require 'selenium-webdriver'
require 'open-uri'

class Api::ApplicationsController < ApplicationController
  before_action :set_application, only: [:destroy]

  # GET /applications
  # GET /applications.json
  def index
    @applications = current_user.applications
  end

  def create
    @application = Application.new(application_params)
    @application.user_id = current_user.id
    @application.save!
    render :show
  end

  def destroy
    @application.destroy
    user = User.find(current_user.id)
    @applications = user.applications
    render :index
  end

  def apply
    # Dir.mkdir(Rails.root.join('tmp'))
    open('resumetest.pdf', 'wb') do |file|
      file << open(current_user.resume.url).read
    end
    resume = Rails.root.to_s + '/resumetest.pdf'
    apps = current_user.applications
    arr = apps.map { |app| [app, Job.find(app.job_id)] }
    debugger
    arr = applyToJob(arr, resume)
    debugger
    arr.map do |el|
      job = el[1]

    end
    @applications = arr.map { |el| el[0] }
    render :index
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_application
      @application = Application.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def application_params
      params.require(:application).permit(:user_id, :job_id, :status)
    end
end

def applyToJob(data, resume)
  user_name = "shoytempus@gmail.com"
  password = "starwars1"
  number = "12033215503"

  driver = Selenium::WebDriver.for :chrome
  driver.navigate.to "https://www.linkedin.com/"

  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  element = driver.find_element(id: 'login-email')
  element.send_keys user_name

  element = driver.find_element(id: 'login-password')
  element.send_keys password



  element = driver.find_element(id: 'login-submit')
  element.click
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)

  data.map.with_index do |el, i|
    driver.navigate.to el[1].url
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    sleep(2)
    apply_btn = driver.find_elements(css: '.js-apply-button')[0]
    apply_btn.click()
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    phone = driver.find_element(id: 'apply-form-phone-input')
    phone.send_keys number
    upload = driver.find_element(id: 'file-browse-input')
    upload.send_keys resume
    debugger
    # driver.find_elements(css: '.jobs-apply-form__follow-company-label')[0].click()
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    @application = Application.find(el[0].id)
    @application.update(status: "sent")
    el[0] = @application
    return el
  end
end
