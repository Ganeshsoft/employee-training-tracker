require 'spec_helper'

describe TrainingRecordSerializer do
  subject { create(:training_record) }

  its(:as_json) { should == "test string" }
end
