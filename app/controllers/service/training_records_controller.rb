class Service::TrainingRecordsController < ApplicationController
  
  acts_as_restful_json
  can_filter_by :competency_id, :trainee_id

end
