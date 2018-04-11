
require 'open-uri'

class Api::ApplicationsController < ApplicationController
  before_action :set_application, only: [:destroy]

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
    resumename = User.find(current_user.id).resumename
    open(resumename + '.pdf', 'wb') do |file|
      file << open(current_user.resume.url).read
    end
    resume = Rails.root.to_s + "/" + resumename + '.pdf'
    apps = current_user.applications.where("status = 'unsent'")
    arr = apps.map { |app| [app, Job.find(app.job_id)] }
    arr = $driver.applyToJob(arr, resume)
    arr.map do |el|
      job = el[1]

    end
    @applications = User.find(current_user.id).applications
    render :index
  end

  private
    def set_application
      @application = Application.find(params[:id])
    end

    def application_params
      params.require(:application).permit(:user_id, :job_id, :status)
    end
end

def applyToJob(data, resume)
  number = User.find(current_user.id).phone

  driver = Selenium::WebDriver.for :chrome
  driver.navigate.to "https://www.linkedin.com/"
  while driver.current_url[0, 29] != "https://www.linkedin.com/feed"
    sleep(1)
  end
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  result = data.map.with_index do |el, i|
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
    driver.find_elements(css: '.jobs-apply-form__follow-company-label')[0].click()
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    @application = Application.find(el[0].id)
    @application.update({status: "sent"})
    el[0] = @application
    el
  end
  driver.close()
  return result
end
