class CreateJobs < ActiveRecord::Migration[5.1]
  def change
    create_table :jobs do |t|
      t.string :position
      t.integer :company_id
      t.string :location
      t.text :description
      t.string :url
      t.boolean :easy

      t.timestamps
    end
  end
end
