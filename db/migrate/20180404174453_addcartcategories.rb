class Addcartcategories < ActiveRecord::Migration[5.1]
  def change
    add_column :jobs, :category, :string, :default => "1"
    Job.all.each do |job|
      job.update_attributes(:category => '1')
    end
  end
end
