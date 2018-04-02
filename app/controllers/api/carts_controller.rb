class Api::CartsController < ApplicationController
  before_action :set_cart, only: [:destroy]

  # GET /carts
  # GET /carts.json
  def index
    @carts = current_user.carts
  end

  def create
    @cart = Cart.new(cart_params)
    @cart.user_id = current_user.id
    @cart.save!
    render :show
  end

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
