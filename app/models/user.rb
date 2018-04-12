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
    carts = self.carts
    carts = driver.fetchDescriptions(carts)
    result = lda(parser(carts.keys.map{|key| carts[key][:description]}))
    result.each.with_index do |el, i|
      cart = params[:carts][i.to_s]
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
      Cart.find(cart[:id]).update({category: category.to_s})
    end
  end

  def apply(driver)
    resumename = self.resumename
    resume = open(resumename + '.pdf', 'wb') do |file|
      file << open(self.resume.url).read
    end
    apps = self.applications.where("status = 'unsent'")
    arr = apps.map { |app| [app, Job.find(app.job_id)] }
    driver.applyToJob(arr, resume)
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

  def fetchDescriptions(cart)
    urls = cart.keys.map{|key| cart[key][:url]}

    urls.each_with_index do |link, i|
      @driver.navigate.to link
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
          cart[i.to_s][:description] = description
          Job.find(cart[i.to_s][:job_id]).update({description: description})
        else
          cart[i.to_s][:description] = Job.find(cart[i.to_s][:job_id])[:description]
        end
      end
    end
    return cart
  end

  def applyToJob(data, resume)
    number = User.find(current_user.id).phone

    result = data.map.with_index do |el, i|
      @driver.navigate.to el[1].url
      wait = Selenium::WebDriver::Wait.new(:timeout => 30)
      sleep(2)
      apply_btn = @driver.find_elements(css: '.js-apply-button')[0]
      apply_btn.click()
      wait = Selenium::WebDriver::Wait.new(:timeout => 30)
      phone = @driver.find_element(id: 'apply-form-phone-input')
      phone.send_keys number
      upload = @driver.find_element(id: 'file-browse-input')
      upload.send_keys resume
      @driver.find_elements(css: '.jobs-apply-form__follow-company-label')[0].click()
      wait = Selenium::WebDriver::Wait.new(:timeout => 30)
      @application = Application.find(el[0].id)
      @application.update({status: "sent"})
      el[0] = @application
      el
    end
    return result
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
