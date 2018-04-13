require 'selenium-webdriver'

class Api::JobsController < ApplicationController
  before_action :set_job, only: [:update]

  def initialize
    @driver = nil
  end

  def index
    if params[:type] == 'apply'
      @jobs = current_user.jobs
    elsif params[:type] == 'sent'
      @jobs = current_user.job_applications
    else
      @jobs = Job.where({'easy' => true})
    end
  end

  def update
    if @job.update(job_params)
      render :show
    else
      render json: @job.errors.full_messages, status: 422
    end
  end

  def li_login
    if params[:status] == 'false'
      $driver = LinkedinAuth.new
      status = $driver.signin(params[:username], params[:password]).to_s
      if status == 'captcha'
        screenshot = File.open($driver.driver.save_screenshot('screenshot.png'))
        User.find(current_user.id).update({screenshot: screenshot})
        screenshot.close
      end
      puts status
      render json: {status: status}
    elsif params[:status] == 'email'
      $driver.email(params[:code])
      status = 'false'
      status = 'true' if $driver.driver.current_url != 'https://www.linkedin.com/uas/ato-pin-challenge-submit'
      render json: {status: status}
    elsif params[:status] == 'captcha'
      position = [params[:clickx].to_i, params[:clicky].to_i]
      $driver.captcha(position)
      screenshot = File.open($driver.driver.save_screenshot('screenshot.png'))
      User.find(current_user.id).update({screenshot: screenshot})
      screenshot.close
      status = 'captcha'
      status = 'true' if $driver.driver.current_url[0, 45] != 'https://www.linkedin.com/uas/consumer-captcha'
      render json: {status: status}
    elsif $driver
      render json: {status: 'true'}
    end
  end

  def scrape_index
    User.find(current_user.id).delay.scrape(params[:location], params[:position], $driver)
    # location = params[:location].split(' ').join('%20')
    # position = params[:position].split(' ').join('%20')
    # data = {location: location, position: position, driver: params[:driver]}
    # jobs = $driver.scrape(data)
    # arr = []
    # jobs.each do |job|
    #   company = 0
    #   if !(Job.find_by(url: job[:url]).nil?)
    #     job.delete(:company)
    #     job.delete(:company_url)
    #     url = job[:url]
    #     job = Job.find_by(url: job[:url]).update(job)
    #     job = Job.find_by(url: url)
    #   else
    #     if !(Company.find_by(name: job[:company]).nil?)
    #       company = Company.find_by(name: job[:company])
    #     else
    #       company = Company.new({name: job[:company], url: job[:company_url]})
    #       company.save!
    #     end
    #     job[:company_id] = company[:id]
    #     job.delete(:company)
    #     job.delete(:company_url)
    #     job = Job.new(job)
    #     job.save!
    #     job = Job.all.last
    #   end
    #   arr.push(job)
    # end
    # @jobs = arr
    # render :index
  end

  # handle_asynchronously :scrape_index

  private

    def set_job
      @job = Job.find(params[:id])
    end

    def job_params
      params.require(:job).permit(:position, :company_id, :location, :description, :url, :easy, :category)
    end
end

class LinkedinAuth
  attr_reader :driver

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
    elsif @driver.current_url[0, 45] == 'https://www.linkedin.com/uas/consumer-captcha'
      status = 'captcha'
    else
      status = 'false'
    end

    return status
  end

  def email(code)
    element = @driver.find_element(id: 'verification-code')
    element.send_keys code

    element = @driver.find_element(id: 'btn-primary')
    element.click
  end

  def captcha(position)
    body = @driver.find_element(css: 'body')
    height = body.size.to_s.split(' ')[-1].split('=')[-1][0...-1].to_i
    width = body.size.to_s.split(' ')[-2].split('=')[-1][0...-1].to_i
    @driver.action.move_to(body, (-0.5 * width + position[0]), (-0.5 * height + position[1])).perform
    @driver.action.click.perform

  end

  def scrape(data)

    @driver.navigate.to 'https://www.linkedin.com/'
    wait = Selenium::WebDriver::Wait.new(:timeout => 60)

    jobs = []
    page = 0
    @driver.navigate.to "https://www.linkedin.com/jobs/search/?keywords=#{data[:position]}&location=#{data[:location]}"
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)

    while page < 1
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

def scrape(data)
  # chrome_bin = ENV.fetch('GOOGLE_CHROME_SHIM', nil)
  # chrome_opts = chrome_bin ? { 'chromeOptions' => { 'binary' => chrome_bin } } : {}
  # options = Selenium::WebDriver::Chrome::Options.new
  # options.add_argument('chromeOptions' => { 'binary' => '/usr/bin/google-chrome' })
  # chrome_bin_path = ENV.fetch('GOOGLE_CHROME_SHIM', '~/usr/bin/google-chrome')
  # chrome_bin_path = '/bin/google-chrome-stable'
  # chrome_bin_path = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
  # debugger
  # chromedriver_path = File.join(File.absolute_path('../..', File.dirname(__FILE__)),'browsers','chromedriver.exe')
  # Selenium::WebDriver::Chrome.driver_path = chromedriver_path
  # driver = Selenium::WebDriver.for :chrome, options: options
  # driver.navigate.to 'https://www.linkedin.com/'


  # user_name = 'shoytempus@gmail.com'
  # password = 'starwars1'
  #
  # wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  #
  #
  # element = driver.find_element(id: 'login-email')
  # element.send_keys user_name
  #
  # element = driver.find_element(id: 'login-password')
  # element.send_keys password
  #
  # element = driver.find_element(id: 'login-submit')
  # element.click
  #
  # wait = Selenium::WebDriver::Wait.new(:timeout => 30)
  # puts driver.current_url
  # options = Selenium::WebDriver::Chrome::Options.new
  # chrome_bin_path = ENV['GOOGLE_CHROME_SHIM']
  # options.binary = chrome_bin_path if chrome_bin_path # only use custom path on heroku

  driver = Selenium::WebDriver.for :chrome
  driver.navigate.to 'https://www.linkedin.com/'
  x = driver.save_screenshot('resumeasy.png')
  # debugger
  while driver.current_url[0, 29] != 'https://www.linkedin.com/feed'
    sleep(1)
  end
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  jobs = []
  page = 0
  driver.navigate.to 'https://www.linkedin.com/jobs/search/?keywords=#{data[:position]}&location=#{data[:location]}'
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)

  while true
    page += 1
    container = wait.until { driver.find_elements(css: '.card-list > li') }
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

    driver.execute_script('window.scrollTo(0, document.body.scrollHeight)')
    sleep(1)
    next_btn = driver.find_elements(css: '.next')[0]
    begin
      next_btn.click()
    rescue
      break
    end
    sleep(1)
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
  end
  driver.quit()
  jobs
end
