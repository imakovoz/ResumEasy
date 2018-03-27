json.extract! job, :id, :position, :company_id, :location, :description, :url, :easy, :created_at, :updated_at
json.url job_url(job, format: :json)
