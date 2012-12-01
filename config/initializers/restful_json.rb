RestfulJson.configure do
  self.can_filter_by_default_using = [:eq]
  self.debug = false
  self.filter_split = ','
  self.formats = :json
  self.number_of_records_in_a_page = 15
  self.predicate_prefix = '!'
  self.return_resource = true
end

