class Employee < ActiveRecord::Base

  belongs_to :department
  has_many :trainer_records, foreign_key: :trained_by_id, class_name: 'TrainingRecord'
  has_many :trainee_records, foreign_key: :trainee_id, class_name: 'TrainingRecord'

  def full_name(reverse = false)
    if reverse
      "#{last_name}, #{first_name}"
    else
      "#{first_name} #{last_name}"
    end
  end

end
