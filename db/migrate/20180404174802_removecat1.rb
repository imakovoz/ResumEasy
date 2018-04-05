class Removecat1 < ActiveRecord::Migration[5.1]
  def change
    remove_column :jobs, :category
    add_column :carts, :category, :string, :default => "1"
    Cart.all.each do |cart|
      cart.update_attributes(:category => '1')
    end
  end
end
