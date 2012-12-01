ActiveAdmin.register CompetencyCategory do

  controller do
    def resource_params
      return [] if request.get?
      [ params[active_admin_config.resource_class.name.underscore.to_sym].permit! ]
    end
  end

  index do
    column :id
    column :name
    default_actions
  end
end
