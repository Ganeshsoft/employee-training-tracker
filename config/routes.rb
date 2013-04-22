Training::Application.routes.draw do
  devise_for :users

  root :to => redirect("/training/")

  ActiveAdmin.routes(self)

  devise_for :admin_users, ActiveAdmin::Devise.config

  get '/training', :to => 'training#index'
  get '/training/*ng_route', :to => 'training#index'

  namespace :service do
    resources :competencies
    resources :competency_categories
    resources :training_records

    match 'competencies/:competency_id/training_records(.:format)' => 'training_records#index'
    match 'employees/:trainee_id/training_records(.:format)' => 'training_records#index'

    resources :departments
    resources :employees
  end

end
