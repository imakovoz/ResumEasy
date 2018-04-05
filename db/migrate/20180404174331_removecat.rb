class Removecat < ActiveRecord::Migration[5.1]
  def change
    remove_column :jobs, :category
  end
end
