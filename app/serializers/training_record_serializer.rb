class TrainingRecordSerializer < ActiveModel::Serializer
  
  attributes :id, :trained_on, :certified_on, :competency_id, :trainee_id, :trained_by_id, :certified_by_id
  has_one :competency, serializer: CompetencyRefSerializer
  has_one :trainee, serializer: EmployeeSerializer

end
