ActiveAdmin.register Employee do

  controller do
    def resource_params
      return [] if request.get?
      [ params[active_admin_config.resource_class.name.underscore.to_sym].permit! ]
    end
  end

  index do
    column :id
    column :first_name
    column :last_name
    column :department
    default_actions
  end
end
