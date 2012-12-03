source 'https://rubygems.org'

gem 'rails', '3.2.9'

gem 'sqlite3'

gem 'restful_json', '>= 3.0.0.alpha.27', :git => 'git://github.com/FineLinePrototyping/restful_json.git'
gem 'devise'
gem 'cancan'
gem 'navigasmic'

# Active Admin
# this version has a hack that keeps you from having to hack the controller with the code we have at the top
# https://github.com/gregbell/active_admin/issues/1731
#gem 'activeadmin', git: 'https://github.com/garysweaver/active_admin.git', branch: 'strong_parameters'
gem 'activeadmin' # using the original for now with the controller hack
gem 'meta_search', '>= 1.1.0.pre'

gem "angularjs-rails-resource", '~> 0.0.2'
gem 'jquery-rails'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'coffee-rails', '~> 3.2.1' # needed for active-admin
  gem 'sass-rails', '~> 3.2.3'
  gem 'compass-rails', '~> 1.0.3'
  gem 'compass_twitter_bootstrap', git: 'https://github.com/kristianmandrup/compass-twitter-bootstrap.git'
  gem 'select2-rails', '~> 3.2.1'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  gem 'therubyracer', platforms: :ruby # needed to precompile assets

  gem 'uglifier', '>= 1.0.3'
end

group :test, :development do
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  # deep_* methods in specs for data setup. overwrite spec/support/factories with: bundle exec stepford factories --path spec/support/
  gem 'stepford'

  gem 'jasmine'
  gem 'ci_reporter'

  # get rid of logging: WARN  Could not determine content-length of response body.
  gem 'thin'

  # get rid of asset pipeline logging
  gem 'quiet_assets'

end


# for local settings overrides
gem 'rails_config'

# Use unicorn as the app server
gem 'unicorn'

