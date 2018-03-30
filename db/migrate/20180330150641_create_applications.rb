class CreateApplications < ActiveRecord::Migration[5.1]
  def change
    create_table :applications do |t|
      t.integer :user_id, null: false
      t.integer :job_id, null: false
      t.string :status, null: false

      t.timestamps
    end
    add_index :applications, [:user_id, :job_id], unique: true
  end
end
