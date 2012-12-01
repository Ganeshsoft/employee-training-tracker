require 'spec_helper'

describe Service::CompetenciesController do

  context "JSON" do

    before(:all) do
      num = 2
      raise "FAIL! Competencies exist before the test!" if Competency.count > 0
      #@controller = Service::TrainingRecordsController
      deep_create_list(:competency, num)
      
      nfound = Competency.count
      raise "There are more Competencies in the DB than expected after test setup. Ensure after(:all) is cleaning up. Got #{nfound} expected #{num}" unless nfound == num
    end

  end
end
