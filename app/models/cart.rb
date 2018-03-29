# == Schema Information
#
# Table name: carts
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  job_id     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Cart < ApplicationRecord
  validates :user, :job, presence: true

  belongs_to :user
  belongs_to :job
end
