class CompetencySerializer < ActiveModel::Serializer
  attributes :id, :name, :procedure_type, :published_on, :competency_category_id, :department_id
  has_one :competency_category, serializer: CompetencyCategoryRefSerializer
  has_one :department, serializer: DepartmentRefSerializer
end
