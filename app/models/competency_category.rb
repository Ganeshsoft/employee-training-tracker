class CompetencyCategory < ActiveRecord::Base
  
  has_one :competency, dependent: :destroy

end
