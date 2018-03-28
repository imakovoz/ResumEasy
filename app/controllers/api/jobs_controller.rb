require 'selenium-webdriver'
require 'bitly'

class Api::JobsController < ApplicationController
  # GET /jobs
  # GET /jobs.json
  def index
    jobs = scrape

    jobs.map! do |job|
      company = 0
      if Job.find_by(url: job[:url])
        Job.find_by(url: job[:url]).update(job)
      else
        if Company.find_by(url: job[:url])
          company = Company.find_by(url: job[:url])
        else
          company = Company.new({name: job[:company], url: job[:company_url]})
          debugger
          company.save!
        end
        job[:company_id] = company[:id]
        job.delete(:company)
        job.delete(:company_url)
        job = Job.new(job)
        job.save!
      end
    end
    @jobs = jobs
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def job_params
      params.require(:job).permit(:position, :company_id, :location, :description, :url, :easy)
    end
end

def scrape
  Bitly.use_api_version_3
  bitly = Bitly.new('imakovoz', 'R_63098aca337046e1a27621bee19ff33c')
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

  driver.navigate.to "https://www.linkedin.com/jobs/search/?keywords=Full%20Stack%20Developer&location=Greater%20New%20York%20City%20Area&locationId=us%3A70"
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
        x = e.find_elements(css: '.job-card-search__company-name-link')[0].attribute('href')
        x = bitly.shorten(x).short_url
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
        x = e.find_elements(tag_name: 'a')[0].attribute('href')
        x = bitly.shorten(x).short_url
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
