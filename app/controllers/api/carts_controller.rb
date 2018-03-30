class Api::CartsController < ApplicationController
  before_action :set_cart, only: [:show, :update, :destroy]

  # GET /carts
  # GET /carts.json
  def index
    @carts = current_user.carts
  end

  # GET /carts/1
  # GET /carts/1.json
  def show
  end
  # POST /carts
  # POST /carts.json
  def create
    @cart = Cart.new(cart_params)
    @cart.user_id = current_user.id
    @cart.save!
    render :show
  end

  # PATCH/PUT /carts/1
  # PATCH/PUT /carts/1.json
  def update
    @cart.update(cart_params)
    render :show
  end

  # DELETE /carts/1
  # DELETE /carts/1.json
  def destroy
    @cart.destroy
    user = User.find(current_user.id)
    @carts = user.carts
    render :index
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cart
      @cart = Cart.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def cart_params
      params.require(:cart).permit(:user_id, :job_id)
    end
end
