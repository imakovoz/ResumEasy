class Application < ApplicationRecord
  validates :user, :job, presence: true

  belongs_to :user
  belongs_to :job
end
