# == Schema Information
#
# Table name: jobs
#
#  id          :integer          not null, primary key
#  position    :string
#  company_id  :integer
#  location    :string
#  description :text
#  url         :string
#  easy        :boolean
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Job < ApplicationRecord
  validates :position, :company_id, :location, :description, :url, presence: true
  validates :url, uniqueness: true

  has_many :carts
  has_many :users,
    through: :carts
end
