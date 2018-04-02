# == Schema Information
#
# Table name: users
#
#  id                  :integer          not null, primary key
#  username            :string           not null
#  password_digest     :string           not null
#  session_token       :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  resume_file_name    :string
#  resume_content_type :string
#  resume_file_size    :integer
#  resume_updated_at   :datetime
#

class User < ApplicationRecord
  validates :username, uniqueness: true, presence: true
  validates :password_digest, :session_token, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }
  has_attached_file :resume
  validates_attachment :resume, :content_type => { :content_type => %w(application/pdf application/msword application/vnd.openxmlformats-officedocument.wordprocessingml.document) }

  after_initialize :ensure_session_token
  attr_reader :password

  has_many :carts
  has_many :jobs,
    through: :carts

  has_many :applications
  has_many :job_applications,
    through: :applications,
    source: :job


  def self.find_by_credentials(username, password)
    user = User.find_by_username(username)

    if user && user.is_password?(password)
      user
    else
      nil
    end
  end

  def self.generate_random_token
    SecureRandom.urlsafe_base64
  end

  def reset_session_token!
    self.session_token = User.generate_random_token
    self.save!
    self.session_token
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  private

  def ensure_session_token
    self.session_token ||= User.generate_random_token
  end

end
