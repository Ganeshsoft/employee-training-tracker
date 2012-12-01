class Department < ActiveRecord::Base
  include RestfulJson::Model

  has_many :competencies
  has_many :employees
end
