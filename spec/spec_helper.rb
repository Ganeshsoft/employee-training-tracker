# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'factory_girl_rails'
require 'stepford/factory_girl'
require 'stepford/factory_girl/rspec_helpers'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
  config.treat_symbols_as_metadata_keys_with_true_values = true
  config.run_all_when_everything_filtered = true
  config.filter_run :focus

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  #config.order = 'random'

  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  #config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically.
  config.infer_base_class_for_anonymous_controllers = false

  config.include FactoryGirl::Syntax::Methods
end

### START: DELETE ALL DATA

raise "Do you really want to delete all #{Rails.env} data? I think not." unless Rails.env == 'test'

# ActiveRecord::Base.subclasses doesn't get everything
ALL_MODEL_CLASSES = Dir[File.join('app','models','*.rb').to_s].collect do |filename|
  model_name = File.basename(filename).sub(/.rb$/, '')
  load File.join('app','models',"#{model_name}.rb")
  model_class = model_name.camelize.constantize
  next unless model_class.ancestors.include?(ActiveRecord::Base)
  model_class
end.compact

ALL_MODEL_CLASSES.each do |m|
  sequenceless_table = false
  begin
    sequenceless_table = true unless m.sequence_name
  rescue => e
    # bug in Rails 3.2.8, at least: undefined method `split' for nil:NilClass in activerecord-3.2.8/lib/active_record/connection_adapters/postgresql_adapter.rb:911:in `default_sequence_name'
    sequenceless_table = true
  end
  puts "rm app/models/#{m.name.underscore}.rb # self.primary_keys = #{m.columns.collect{|c|c.name.to_sym}.inspect}" if sequenceless_table && m.columns.size == 2
end

# can run rspec instead of rake test. FactoryGirl doesn't clean up everything, and DatabaseCleaner is either too slow (truncation) or too transaction-y (transaction).
RSpec::Runner.configure do |config|
  config.before(:suite) do
    ALL_MODEL_CLASSES.each do |m|
      begin
        m.delete_all
      rescue
      end
    end
    ALL_MODEL_CLASSES.each do |m|
      count = m.count
      raise "#{m} not all deleted (found #{count})" if count > 0
    end
  end

  config.after(:all) do
    ALL_MODEL_CLASSES.each do |m|
      begin
        m.delete_all
      rescue
      end
    end
    ALL_MODEL_CLASSES.each do |m|
      count = m.count
      raise "#{m} not all deleted (found #{count})" if count > 0
    end
  end
end

### END: DELETE ALL DATA

def json_get(*args)
  default_options = {format: :json}
  options = args.extract_options!
  get args[0], default_options.deep_merge(options)
end

def json_get_raw(action, params = {}, body)
  default_options = {format: :json}
  @request.env['RAW_POST_DATA'] = body
  response = get(action, default_options.deep_merge(params))
  @request.env.delete('RAW_POST_DATA')
  response
end

def json_post(*args)
  default_options = {format: :json}
  options = args.extract_options!
  post args[0], default_options.deep_merge(options)
end

def json_post_raw(action, params = {}, body)
  default_options = {format: :json}
  @request.env['RAW_POST_DATA'] = body
  response = post(action, default_options.deep_merge(params))
  @request.env.delete('RAW_POST_DATA')
  response
end

def json_put(*args)
  default_options = {format: :json}
  options = args.extract_options!
  put args[0], default_options.deep_merge(options)
end

def json_put_raw(action, params = {}, body)
  default_options = {format: :json}
  @request.env['RAW_POST_DATA'] = body
  response = put(action, default_options.deep_merge(params))
  @request.env.delete('RAW_POST_DATA')
  response
end

def json_delete(*args)
  default_options = {format: :json}
  options = args.extract_options!
  delete args[0], default_options.deep_merge(options)
end

def json_delete_raw(action, params = {}, body)
  default_options = {format: :json}
  @request.env['RAW_POST_DATA'] = body
  response = delete(action, default_options.deep_merge(params))
  @request.env.delete('RAW_POST_DATA')
  response
end

# partially from http://jacob.hoffman-andrews.com/README/index.php/2011/04/14/ruby-function-stfu-temporarily-redirect-noisy-stdout-writes-to-devnull/
# do sio = StringIO.new and pass in sio, then do sio.string to get the output as a string
# Usage:
# s = capture_output do
#   ...
# end
# s.downcase.should_not match /rollback/
#def capture_stdout_and_stderr
#  sio = StringIO.new
#  begin
#    orig_stderr = $stderr.clone
#    orig_stdout = $stdout.clone
#    $stderr = sio
#    $stdout = sio
#    yield
#  rescue Exception => e
#    $stdout.reopen orig_stdout
#    $stderr.reopen orig_stderr
#    raise e
#  ensure
#    $stdout.reopen orig_stdout
#    $stderr.reopen orig_stderr
#  end
#  sio.string
#end

# allow describe and context to be disabled by prefixing 'x' (xit is already supported in rspec)
module Kernel
private

  def xdescribe(*args, &blk)
    describe *args do
      pending "xxxxxxxxx"
    end
  end

  def xcontext(*args, &blk)
    context *args do
      pending "xxxxxxxxx"
    end
  end

end
