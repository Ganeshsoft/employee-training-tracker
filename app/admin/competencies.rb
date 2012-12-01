ActiveAdmin.register Competency do

  controller do
    def resource_params
      return [] if request.get?
      [ params[active_admin_config.resource_class.name.underscore.to_sym].permit! ]
    end
  end

  index do
    column :id
    column :name
    column :competency_category
    column :procedure_type
    column :published_on
    default_actions
  end
end
