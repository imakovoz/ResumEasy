class Screenshotuser < ActiveRecord::Migration[5.1]
  def change
    add_attachment :users, :screenshot
  end
end
