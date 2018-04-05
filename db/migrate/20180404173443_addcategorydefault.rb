class Addcategorydefault < ActiveRecord::Migration[5.1]
  def change
    change_column :jobs, :category, :string, :default => "1"
  end
end
