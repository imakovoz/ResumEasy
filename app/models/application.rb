# == Schema Information
#
# Table name: applications
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  job_id     :integer          not null
#  status     :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Application < ApplicationRecord
  validates :user, :job, presence: true

  belongs_to :user
  belongs_to :job
end
