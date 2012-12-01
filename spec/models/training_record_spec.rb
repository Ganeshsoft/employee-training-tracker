require 'spec_helper'

describe TrainingRecord do
  before(:each) do
    @record = deep_build(:training_record)
  end

  it "should allow create with valid attributes" do
    @record.save.should be_true, "training record not saved! errors: #{@record.errors.inspect}"
  end

  it "should require trainer" do
    @record.trainee_id = nil
    @record.should_not be_valid
  end

  it "should require competency" do
    @record.competency_id = nil
    @record.should_not be_valid
  end

  it "should require trainer" do
    @record.trained_by_id = nil
    @record.should_not be_valid
  end

  it "should require trained date" do
    @record.trained_on = nil
    @record.should_not be_valid
  end

  it "should not require certified by/date" do
    @record.certified_on = nil
    @record.certified_by_id = nil
    @record.should be_valid
  end

  it "should not allow duplicate trainee / competency" do
    dupe = deep_build(:training_record)
    dupe.trainee_id = @record.trainee_id
    dupe.competency_id = @record.competency_id

    @record.save.should be_true, "training record not saved! errors: #{@record.errors.inspect}"
    dupe.save.should_not be_true
  end
end
