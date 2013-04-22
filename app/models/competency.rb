class Competency < ActiveRecord::Base

  belongs_to :department
  belongs_to :competency_category
  has_many :training_records

  validates_uniqueness_of :name

end
