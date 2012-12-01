#require 'tracer'
#Tracer.on

Stepford::FactoryGirl.debug = false

# each entry looks like [:model_name, :association_or_column_name]
Stepford::FactoryGirl.column_overrides = {
  [:admin_user, :encrypted_password] => {null: false, default: 'fake encrypted password'}
}
