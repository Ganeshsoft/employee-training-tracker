class Service::TrainingRecordPermitter < ActionController::Permitter

  permit :certified_by_id, :certified_on, :competency_id, :id, :trained_by_id, :trained_on, :trainee_id

end
