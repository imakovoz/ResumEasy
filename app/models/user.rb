# == Schema Information
#
# Table name: users
#
#  id                  :integer          not null, primary key
#  username            :string           not null
#  password_digest     :string           not null
#  session_token       :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  resume_file_name    :string
#  resume_content_type :string
#  resume_file_size    :integer
#  resume_updated_at   :datetime
#  firstname           :string
#  lastname            :string
#  resumename          :string
#  phone               :string
#

class User < ApplicationRecord
  validates :username, uniqueness: true, presence: true
  validates :password_digest, :session_token, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }
  has_attached_file :resume
  validates_attachment :resume, :content_type => { :content_type => %w(application/pdf application/msword application/vnd.openxmlformats-officedocument.wordprocessingml.document) }
  has_attached_file :screenshot, default_url: lambda { |image| ActionController::Base.helpers.asset_path('screenshot.png') }
  validates_attachment_content_type :screenshot, :content_type => /\Aimage\/.*\Z/

  after_initialize :ensure_session_token
  attr_reader :password

  has_many :carts
  has_many :jobs,
    through: :carts

  has_many :applications
  has_many :job_applications,
    through: :applications,
    source: :job

  def self.find_by_credentials(username, password)
    user = User.find_by_username(username)

    if user && user.is_password?(password)
      user
    else
      nil
    end
  end

  def self.generate_random_token
    SecureRandom.urlsafe_base64
  end

  def reset_session_token!
    self.session_token = User.generate_random_token
    self.save!
    self.session_token
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def scrape(location, position, driver)
    location = location.split(' ').join('%20')
    position = position.split(' ').join('%20')
    data = {location: location, position: position}
    jobs = driver.scrape(data)
    jobs.each do |job|
      company = 0
      if !(Job.find_by(url: job[:url]).nil?)
        job.delete(:company)
        job.delete(:company_url)
        url = job[:url]
        job = Job.find_by(url: job[:url]).update(job)
        job = Job.find_by(url: url)
      else
        if !(Company.find_by(name: job[:company]).nil?)
          company = Company.find_by(name: job[:company])
        else
          company = Company.new({name: job[:company], url: job[:company_url]})
          company.save!
        end
        job[:company_id] = company[:id]
        job.delete(:company)
        job.delete(:company_url)
        job = Job.new(job)
        job.save!
        job = Job.all.last
      end
    end
  end

  def sort(driver)
    jobs = driver.fetchDescriptions(self.jobs)
    result = lda(parser(jobs.map{|job| job[:description]}))
    result.each.with_index do |el, i|
      cart = self.carts.find_by({ job_id: jobs[i][:id] })
      category = 0
      if (el[0].is_a? Float) || (el[0].is_a? Integer)
        max = -999999999
        el.each.with_index do |e, j|
          if e > max
            category = j + 1
            max = e
          end
        end
      end
      cart.update({category: category.to_s})
    end
  end

  def apply(driver)
    resumename = self.resumename
    resume = open(resumename + '.pdf', 'wb') do |file|
      file << open(self.resume.url).read
    end


    apps = self.applications.where("status = 'unsent'")
    arr = apps.map { |app| [app, Job.find(app.job_id)] }
    driver.applyToJob(arr, resume, self.phone)
  end




  private

  def ensure_session_token
    self.session_token ||= User.generate_random_token
  end

end

class LinkedinAuth
  attr_accessor :driver

  def initialize
    options = Selenium::WebDriver::Chrome::Options.new
    chrome_bin_path = ENV['GOOGLE_CHROME_SHIM']
    options.binary = chrome_bin_path if chrome_bin_path # only use custom path on heroku
    @driver = Selenium::WebDriver.for :chrome, options: options
  end

  def signin(username, password)
    @driver.navigate.to 'https://www.linkedin.com/'
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    element = @driver.find_element(id: 'login-email')
    element.send_keys username

    element = @driver.find_element(id: 'login-password')
    element.send_keys password

    element = @driver.find_element(id: 'login-submit')
    element.click
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    puts @driver.current_url
    if @driver.current_url[0, 29] == 'https://www.linkedin.com/feed'
      status = 'true'
    elsif @driver.current_url == 'https://www.linkedin.com/uas/consumer-email-challenge'
      status = 'email'
    else
      status = 'false'
    end

    return [@driver.save_screenshot('screenshot.png'), status]
  end

  def info
    return @driver.current_url
  end

  def email(code)
    element = @driver.find_element(id: 'verification-code')
    element.send_keys code

    element = @driver.find_element(id: 'btn-primary')
    element.click
  end

  def scrape(data)

    @driver.navigate.to 'https://www.linkedin.com/'
    wait = Selenium::WebDriver::Wait.new(:timeout => 60)

    jobs = []
    page = 0
    @driver.navigate.to "https://www.linkedin.com/jobs/search/?keywords=#{data[:position]}&location=#{data[:location]}"
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)

    while true
      page += 1
      puts @driver.current_url
      container = wait.until { @driver.find_elements(css: '.card-list > li') }
      lis = container.dup
      container.map{|e| e.location_once_scrolled_into_view}
      lis.each_with_index do |e, i|
        job = Hash.new
        begin
          x = e.find_elements(tag_name: 'h3')[0].text
        rescue
          x = ''
        end
        job[:position]= x
        begin
          x = e.find_elements(tag_name: 'h4')[0].text
        rescue
          x = ''
        end
        job[:company]= x
        begin
          x = e.find_elements(css: '.job-card-search__company-name-link')[0].attribute('href').split('?eBP=')[0]
        rescue
          x = ''
        end
        job[:company_url]= x
        begin
          x = e.find_elements(tag_name: 'h5')[0].text[13..-1]
        rescue
          x = ''
        end
        job[:location]= x
        begin
          x = e.find_elements(tag_name: 'p')[0].text
        rescue
          x = ''
        end
        job[:description]= x
        begin
          x = e.find_elements(tag_name: 'a')[0].attribute('href').split('?eBP=')[0]
        rescue
          x = ''
        end
        job[:url]= x
        begin
          x = e.find_elements(css: '.job-card-search__easy-apply-text')[0].text == 'Easy Apply'
        rescue
          x = false
        end
        job[:easy]= x
        jobs.push(job) if job[:position] != 'See jobs where you are a top applicant'
      end

      @driver.execute_script('window.scrollTo(0, document.body.scrollHeight)')
      sleep(1)
      next_btn = @driver.find_elements(css: '.next')[0]
      begin
        next_btn.click()
      rescue
        break
      end
      sleep(1)
      wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    end
    return jobs
  end

  def fetchDescriptions(jobs)
    urls = jobs
    arr = []

    urls.each_with_index do |job, i|
      @driver.navigate.to job[:url]
      wait = Selenium::WebDriver::Wait.new(:timeout => 30)
      begin
        expired = @driver.find_element(css: '.jobs-details-top-card__expired-job')
        if expired
          Job.find(cart[i.to_s][:job_id]).destroy
        end
      rescue
        view_more = @driver.find_elements(css: '.view-more-icon')[0]
        begin
          view_more.click()
          sleep(1)
        rescue

        end
        sleep(1)
        desc_container = @driver.find_elements(css: '#job-details *')
        # check to see if odd formatting is cause all text in one div (ember or some other linkedin markup)
        desc_container = [@driver.find_element(css: '#job-details')] if @driver.find_element(css: '#job-details').text.length > 100
        desc = []
        desc_container.each do |e|
          begin
            desc.push(e.text)
          rescue
            desc.push("")
          end
        end
        description = desc.join(' ').gsub(/[^A-Za-z ]/, ' ').gsub(/\s+/, ' ').downcase
        if description.length > 200
          job.update({description: description})
        end
        arr.push(job)
      end
    end
    return arr
  end

  def applyToJob(data, resume, phone)

    data.each.with_index do |el, i|
      @driver.navigate.to el[1].url
      wait = Selenium::WebDriver::Wait.new(:timeout => 30)
      sleep(2)
      begin
        @driver.find_element(css: '.js-apply-button').click()
        wait = Selenium::WebDriver::Wait.new(:timeout => 30)
        @driver.find_element(id: 'apply-form-phone-input').send_keys phone
        upload = @driver.find_element(id: 'file-browse-input')
        resume = Rails.root.join(open(resume))
        upload.send_keys resume.realpath.to_s
        @driver.find_elements(css: '.jobs-apply-form__follow-company-label')[0].click()
        wait = Selenium::WebDriver::Wait.new(:timeout => 30)
        @application = Application.find(el[0].id)
        @application.update({status: "sent"})
      rescue
        apply_btn = @driver.find_element(css: '.jobs-s-apply__button')
        Job.find(el[0].job_id).destroy
        # @driver.navigate.to @driver.current_url.split('/')[0...3].concat(["job-apply"]).concat([@driver.current_url.split('/')[-1]]).join('/')
        # wait = Selenium::WebDriver::Wait.new(:timeout => 30)
        # sleep(2)
        # @driver.find_elements(css: '.phone-num-input > input')[1].send_keys phone
        # upload = @driver.find_element(css: '.upload-btn')
        # upload.send_keys resume
        # questions = @driver.find_elements(css: '.question-wrapper')
        # questions.each do |q|
        #   q.find_elements(css: 'input')[0].click()
        # end
        # @driver.action.key_down(:command).send_keys('1').key_up(:command).perform
      end
    end
  end
end

def linkedin_login(username, password, driver)
  if driver == '0'
    options = Selenium::WebDriver::Chrome::Options.new
    chrome_bin_path = ENV['GOOGLE_CHROME_SHIM']
    options.binary = chrome_bin_path if chrome_bin_path # only use custom path on heroku
    driver = Selenium::WebDriver.for :chrome
  else
    options = Selenium::WebDriver::Chrome::Options.new
    driver = Selenium::WebDriver.for(:remote, :desired_capabilities => {session_id: driver})
  end
  driver.navigate.to 'https://www.linkedin.com/'
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)
  element = driver.find_element(id: 'login-email')
  element.send_keys username

  element = driver.find_element(id: 'login-password')
  element.send_keys password

  element = driver.find_element(id: 'login-submit')
  element.click
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)
  status = (driver.current_url[0, 29] == 'https://www.linkedin.com/feed')

  return [driver.save_screenshot('screenshot.png'), driver, status]
end
def parser(corpus)
  stopwords = ['the','of','and','to','a','in','for','is','on','that','by','this','with','i','you','it','not','or','be','are','from','at','as','your','all','have','new','more','an','was','we','will','home','can','us','about','if','page','my','has','search','free','but','our','one','other','do','no','information','time','they','site','he','up','may','what','which','their','news','out','use','any','there','see','only','so','his','when','contact','here','business','who','web','also','now','help','get','pm','view','online','c','e','first','am','been','would','how','were','me','s','services','some','these','click','its','like','service','x','than','find','price','date','back','top','people','had','list','name','just','over','state','year','day','into','email','two','health','n','world','re','next','used','go','b','work','last','most','products','music','buy','data','make','them','should','product','system','post','her','city','t','add','policy','number','such','please','available','copyright','support','message','after','best','software','then','jan','good','video','well','d','where','info','rights','public','books','high','school','through','m','each','links','she','review','years','order','very','privacy','book','items','company','r','read','group','need','many','user','said','de','does','set','under','general','research','university','january','mail','full','map','reviews','program','life','know','games','way','days','management','p','part','could','great','united','hotel','real','f','item','international','center','ebay','must','store','travel','comments','made','development','report','off','member','details','line','terms','before','hotels','did','send','right','type','because','local','those','using','results','office','education','national','car','design','take','posted','internet','address','community','within','states','area','want','phone','dvd','shipping','reserved','subject','between','forum','family','l','long','based','w','code','show','o','even','black','check','special','prices','website','index','being','women','much','sign','file','link','open','today','technology','south','case','project','same','pages','uk','version','section','own','found','sports','house','related','security','both','g','county','american','photo','game','members','power','while','care','network','down','computer','systems','three','total','place','end','following','download','h','him','without','per','access','think','north','resources','current','posts','big','media','law','control','water','history','pictures','size','art','personal','since','including','guide','shop','directory','board','location','change','white','text','small','rating','rate','government','children','during','usa','return','students','v','shopping','account','times','sites','level','digital','profile','previous','form','events','love','old','john','main','call','hours','image','department','title','description','non','k','y','insurance','another','why','shall','property','class','cd','still','money','quality','every','listing','content','country','private','little','visit','save','tools','job','work','few','look','u','work','experience','working','employment','skills','team','poster','premium','strong']
  data = []
  count = 0
  word_frequency = Hash.new(0)

  corpus.each_with_index do |text, i|
    count += 1
    text = text.split(' ').map!{|x| x.gsub(/(\W|\d)/, '')}
    stopwords.each_with_index do |word, i|
      text = text.reject{|s| s == word}
    end

    text.uniq.each do |word|
      word_frequency[word] += 1
    end
    data << text
  end

  word_frequency.each do |k, v|
    if v > (0.4 * count)
      data.map!.with_index do |x, idx|
        x.reject{|w| w == k}
      end
    end
  end

  return data
end

def lda(text)
  corpus = Lda::Corpus.new

  text.each do |description|
    corpus.add_document(Lda::TextDocument.new(corpus, description.join(' ')))
  end

  lda = Lda::Lda.new(corpus)
  lda.verbose = false
  lda.num_topics = 5
  lda.max_iter = 100
  lda.init_alpha = 0.8
  lda.em('random')
  topics = lda.top_words(10)
  matrix = lda.compute_topic_document_probability
  topics.each do |topic|
    puts '****'
    puts topic
  end

  return matrix
end
