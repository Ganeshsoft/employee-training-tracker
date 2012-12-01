class TrainingRecordPermitter < ApplicationPermitter
  permit :certified_by_id
  permit :certified_on
  permit :competency_id
  permit :id
  permit :trained_by_id
  permit :trained_on
  permit :trainee_id
end
