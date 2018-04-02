class Updateuser < ActiveRecord::Migration[5.1]
  def change
    add_attachment :users, :resume
  end
end
