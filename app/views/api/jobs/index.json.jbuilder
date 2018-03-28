@jobs.each do |job|
  json.set! job.id do
    json.partial! 'job', job: job
  end
end
