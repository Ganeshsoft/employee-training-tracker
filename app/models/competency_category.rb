class CompetencyCategory < ActiveRecord::Base
  include RestfulJson::Model
  
  has_one :competency, dependent: :destroy

end
