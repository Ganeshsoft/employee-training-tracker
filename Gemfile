source 'https://rubygems.org'

gem 'rails', '~> 3.2.13'

gem 'sqlite3', '~> 1.3.7'

gem 'restful_json', '~> 3.4.1'
gem 'devise', '~> 2.2.3'
gem 'strong_parameters', '~> 0.2.0'
gem 'cancan', '~> 1.6.9'
gem 'active_model_serializers', '~> 0.7.0'
gem 'navigasmic', '~> 1.0.4'

gem 'activeadmin', '~> 0.6.0'
gem 'meta_search', '~> 1.1.3'

gem 'angularjs-rails-resource', '~> 0.1.4'
gem 'jquery-rails', '~> 2.1.4'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'coffee-rails', '~> 3.2.2' # needed for active-admin
  gem 'sass-rails', '~> 3.2.6'
  gem 'compass-rails', '~> 1.0.3'
  gem 'compass_twitter_bootstrap', '~> 2.0.3'
  gem 'select2-rails', '~> 3.2.1'

  # Commented therubyracer, because not supported in Windows
  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  #gem 'therubyracer', '~> 0.11.4', platforms: :ruby # needed to precompile assets

  gem 'uglifier', '~> 2.0.1'
end

group :test, :development do
  gem 'rspec-rails', '~> 2.13.0'
  gem 'factory_girl_rails', '~> 4.2.1'
  # deep_* methods in specs for data setup. overwrite spec/support/factories with: bundle exec stepford factories --path spec/support/
  gem 'stepford', '~> 0.15.1'

  gem 'jasmine', '~> 1.3.2'
  gem 'ci_reporter', '~> 1.8.4'

  # get rid of logging: WARN  Could not determine content-length of response body.
  #gem 'thin'

  # get rid of asset pipeline logging
  gem 'quiet_assets', '~> 1.0.2'

end


# for local settings overrides
gem 'rails_config', '~> 0.3.3'

# Commented unicorn, because not supported in Windows
# Use unicorn as the app server
#gem 'unicorn'
