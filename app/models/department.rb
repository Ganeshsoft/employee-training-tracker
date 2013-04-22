class Department < ActiveRecord::Base

  has_many :competencies
  has_many :employees
  
end
