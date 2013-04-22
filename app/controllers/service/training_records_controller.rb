class Service::TrainingRecordsController < ApplicationController
  
  include RestfulJson::DefaultController
  can_filter_by :competency_id, :trainee_id

end
