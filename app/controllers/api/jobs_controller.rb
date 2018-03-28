require 'selenium-webdriver'
require 'bitly'

class Api::JobsController < ApplicationController
  # GET /jobs
  # GET /jobs.json
  def index
    @jobs = Job.all
  end

  def scrape_index
    location = params[:location].split(" ").join("%20")
    position = params[:position].split(" ").join("%20")
    data = {location: location, position: position}
    jobs = scrape(data)
    arr = []
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
      arr.push(job)
    end
    @jobs = arr
    render :index
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def job_params
      params.require(:job).permit(:position, :company_id, :location, :description, :url, :easy)
    end
end

def scrape(data)
  user_name = "shoytempus@gmail.com"
  password = "starwars1"

  driver = Selenium::WebDriver.for :chrome
  driver.navigate.to "https://www.linkedin.com/"

  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  element = driver.find_element(id: 'login-email')
  element.send_keys user_name

  element = driver.find_element(id: 'login-password')
  element.send_keys password

  element = driver.find_element(id: 'login-submit')
  element.click()

  wait = Selenium::WebDriver::Wait.new(:timeout => 30)
  jobs = []
  page = 0
  driver.navigate.to "https://www.linkedin.com/jobs/search/?keywords=#{data[:position]}&location=#{data[:location]}"
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)

  while page < 1
    page += 1
    container = wait.until { driver.find_elements(css: '.card-list > li') }
    lis = container.dup
    container.map{|e| e.location_once_scrolled_into_view}
    lis.each_with_index do |e, i|
      job = Hash.new
      begin
        x = e.find_elements(tag_name: 'h3')[0].text
      rescue
        x = ""
      end
      job[:position]= x
      begin
        x = e.find_elements(tag_name: 'h4')[0].text
      rescue
        x = ""
      end
      job[:company]= x
      begin
        x = e.find_elements(css: '.job-card-search__company-name-link')[0].attribute('href').split('?eBP=')[0]
      rescue
        x = ""
      end
      job[:company_url]= x
      begin
        x = e.find_elements(tag_name: 'h5')[0].text[13..-1]
      rescue
        x = ""
      end
      job[:location]= x
      begin
        x = e.find_elements(tag_name: 'p')[0].text
      rescue
        x = ""
      end
      job[:description]= x
      begin
        x = e.find_elements(tag_name: 'a')[0].attribute('href').split('?eBP=')[0]
      rescue
        x = ""
      end
      job[:url]= x
      begin
        x = e.find_elements(css: '.job-card-search__easy-apply-text')[0].text == "Easy Apply"
      rescue
        x = false
      end
      job[:easy]= x
      jobs.push(job) if job[:position] != "See jobs where you are a top applicant"
    end

    driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
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
