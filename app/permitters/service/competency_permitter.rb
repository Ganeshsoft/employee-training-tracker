class Service::CompetencyPermitter < ActionController::Permitter

  permit :published_on
  
end
