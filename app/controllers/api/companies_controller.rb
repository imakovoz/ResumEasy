class Api::CompaniesController < ApplicationController
  before_action :set_company, only: [:show, :edit, :update]

  def index
    @companies = Company.all
  end

  def show
  end

  def new
    @company = Company.new
  end

  def edit
  end

  def create
    @company = Company.new(company_params)
    @company.save!
    render :show
  end

  def update
    @company.update(company_params)
    render :show
  end


  private
    def set_company
      @company = Company.find(params[:id])
    end

    def company_params
      params.require(:company).permit(:name, :size, :url)
    end
end
