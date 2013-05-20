require 'spec_helper'
require 'factory_girl'

describe Service::TrainingRecordsController do
  login_user

  context "JSON" do

    before(:all) do
      raise "FAIL! TrainingRecords exist before the test!" if TrainingRecord.count > 0
      @num = 10
      @num.times do |i|
        deep_create(:training_record)
      end
      
      nfound = TrainingRecord.count
      raise "There are more TrainingRecords in the DB than expected after test setup. Ensure after(:all) is cleaning up. Got #{nfound} expected #{num}" unless nfound == @num
    end

    it "index should return 10 json objects" do         
      json_get :index
      response.status.should eq(200), "index failed (#{response.status}): #{response.body}"
      JSON.parse(response.body)['training_records'].size.should eq(@num)
    end

    it "show should return 1 json object" do
      json_get :show, id: TrainingRecord.first.id
      response.status.should eq(200), "show failed (#{response.status}): #{response.body}"
      JSON.parse(response.body)['training_record'].should_not be_nil
    end

    it "index should return not deleted records" do
      TrainingRecord.first.destroy

      json_get :index
      response.status.should eq(200), "got #{response.status}: #{response.body}"
      JSON.parse(response.body)['training_records'].size.should eq(@num - 1), "Got unexpected number of records:\n#{response.body.inspect}"
    end

    it "create should add object so that subsequent get with same id works" do
      json = build(:training_record).as_json
      json_post :create, training_record: deep_build(:training_record).as_json
      val = JSON.parse(response.body)
      val.should_not be_nil
      val['training_record'].should_not be_nil
      val['training_record']['id'].should_not be_nil
      json_get :show, id: val['training_record']['id']
      response.status.should eq(200), "show failed (#{response.status}): #{response.body}"
      tr_json = JSON.parse(response.body)['training_record']
      tr_json.should_not be_nil
      tr_json['id'].to_s.should eq(val['training_record']['id'].to_s)
    end

    it "duplicate create should fail" do
      json = build(:training_record).as_json
      json_post :create, training_record: deep_build(:training_record).as_json
      response.status.should eq(201), "Failed, #{response.inspect}"
      # should fail second post
      json_post :create, training_record: deep_build(:training_record).as_json
      response.status.should eq(422)
      JSON.parse(response.body)['errors'].should_not be_nil
    end

    it "create with twice wrapped object should return 422" do
      json = build(:training_record).as_json
      json_post :create, training_record: {training_record: {id: 99999999999991}}
      response.status.should eq(422), "Failed, #{response.inspect}"
    end

    it "create with invalid json should return 422" do
      json = build(:training_record).as_json
      json_post_raw :create, "{this is invalid json'}"
      response.status.should eq(422), "Failed, #{response.inspect}"
    end

    it "update should update object so that subsequent get with same id gets updated object" do
      record = TrainingRecord.first
      id = record.id
      d1 = record.trained_on
      record.trained_on = d1 - 2.days
      d2 = record.trained_on
      d2.should_not eq(d1) # test setup assumption
      json_put :update, id: id, training_record: record.as_json
      response.status.should eq(200), "update failed (#{response.status}) with response: #{response.body}"
      json_get :show, id: id
      response.status.should eq(200), "show failed (#{response.status}): #{response.body}"
      JSON.parse(response.body)['training_record'].should_not be_nil
      date = JSON.parse(response.body)['training_record']['trained_on']
      date.should_not be_nil
      date.should eq(d2.strftime('%FT%T.000Z'))
    end

    it "after destroy should not return training record" do
      id = TrainingRecord.first.id
      json_delete :destroy, id: id
      TrainingRecord.where(id: id).to_a.should be_empty
    end

    it "invalidated training record should return 422" do
      record = TrainingRecord.first
      record.trainee_id = nil
      json_put :update, id: record.id, training_record: record.as_json
      response.status.should eq(422), "update should have failed with 422 but got #{response.status} with body: #{response.body}"
    end

    it "json referring to invalid attribute should return a 200 just like a normal update" do
      record = TrainingRecord.first
      record.trainee_id = nil
      json_put :update, id: record.id, training_record: {training_record: {id: record.id}}
      response.status.should eq(200), "update should have returned 200, but got #{response.status} with body: #{response.body}"
    end

    it "if training record sent as a wrapped string instead of a hash, shouldn't fail with 500 error" do
      record = TrainingRecord.first
      record.trainee_id = nil
      json_put :update, id: record.id, training_record: "{this is invalid json'}"
      response.status.should eq(200), "update should have failed with 200 but got #{response.status} with body: #{response.body}"
    end

    it "if training record sent as a wrapped string instead of a hash, shouldn't fail with 500 error" do
      record = TrainingRecord.first
      record.trainee_id = nil
      json_put :update, id: record.id, this_is_not_valid: "{this is invalid json'}"
      response.status.should eq(200), "update should have failed with 200 but got #{response.status} with body: #{response.body}"
    end

    it "if training record sent as a string instead of a hash, shouldn't fail with 500 error" do
      record = TrainingRecord.first
      record.trainee_id = nil
      json_put_raw :update, {id: record.id}, "{this is invalid json'}"
      response.status.should eq(200), "update should have failed with 200 but got #{response.status} with body: #{response.body}"
    end
  end
end
