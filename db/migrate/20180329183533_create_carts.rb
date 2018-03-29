class CreateCarts < ActiveRecord::Migration[5.1]
  def change
    create_table :carts do |t|
      t.integer :user_id, null: false
      t.integer :job_id, null: false

      t.timestamps
    end
    add_index :carts, [:user_id, :job_id], unique: true
  end
end
