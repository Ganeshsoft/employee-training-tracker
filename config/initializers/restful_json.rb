RestfulJson.configure do
  # we use this, and it is different from the default config
  self.return_resource = true

  # being explicit about these because we use them
  self.use_permitters = true
  self.return_error_data = true

  # being explicit about this because the version of ActiveModel::Serializers we use has had issues with respond_with
  self.avoid_respond_with = true
end
