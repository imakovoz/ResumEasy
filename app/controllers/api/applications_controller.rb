class Api::ApplicationsController < ApplicationController
  before_action :set_application, only: [:show, :update, :destroy]

  # GET /applications
  # GET /applications.json
  def index
    @applications = current_user.applications
  end

  # GET /applications/1
  # GET /applications/1.json
  def show
  end
  # POST /applications
  # POST /applications.json
  def create
    @application = Application.new(application_params)
    @application.user_id = current_user.id
    @application.save!
    render :show
  end

  # PATCH/PUT /applications/1
  # PATCH/PUT /applications/1.json
  def update
    @application.update(application_params)
    render :show
  end

  # DELETE /applications/1
  # DELETE /applications/1.json
  def destroy
    @application.destroy
    user = User.find(current_user.id)
    @applications = user.applications
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
