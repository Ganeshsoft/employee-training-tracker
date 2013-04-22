class TrainingRecord < ActiveRecord::Base
  
  belongs_to :trainee, class_name: 'Employee'
  belongs_to :certified_by, class_name: 'Employee'
  belongs_to :trained_by, class_name: 'Employee'
  belongs_to :competency, class_name: 'Competency'

  validates :trainee_id, uniqueness: { scope: [:competency_id], :message => "A training record already exists for the competency." }, on: :create
  validates :competency_id, presence: {message: 'The competency is required.'}
  validates :trainee_id, presence: {message: 'The trainee is required.'}
  validates :trained_by_id, presence: {message: 'A trainer is required.'}
  validates :trained_on, presence: {message: 'A training date is required.'}
   
end
