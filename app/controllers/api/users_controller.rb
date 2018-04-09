class Api::UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  def index
    @users = User.all
  end

  def show
  end

  def new
    @user = User.new
  end

  def edit
  end

  def create
    @user = User.new(user_params)

    if @user.save
      login(@user)
      render json: {id: @user.id, username: @user.username }
    else
      render json: {errors: @user.errors}, status: 422
    end
  end

  def update
    if @user.update(user_params)
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def search_index
    @users = User.where("firstname ILIKE ? or lastname ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
    render :index
  end

  private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:username, :password_digest, :session_token, :password, :resume, :firstname, :lastname, :resumename, :phone)
    end
end
