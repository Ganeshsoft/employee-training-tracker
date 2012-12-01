# Don't think this is necessary since setting timezone in application.rb, but leaving here just in case
# Time.zone = 'America/New_York'

class Time
  def as_json(options = nil) #:nodoc:
    # return UTC time in Javascript format, e.g. "2012-08-12T04:00:00.000Z"
    "#{utc.strftime('%Y-%m-%dT%H:%M:%S.%3NZ')}"
    # return UTC time in format: 2012-08-20T13:24:59+0000
    #"#{utc.strftime('%Y-%m-%dT%H:%M:%S%z')}"
    # return time in current zone in format: 2012-08-20T09:26:47-0400
    #"#{strftime('%Y-%m-%dT%H:%M:%S%z')}"
  end
end

class Date
  def as_json(options = nil) #:nodoc:
    # return UTC time in Javascript format, e.g. "2012-08-12T04:00:00.000Z"
    "#{to_time(:utc).strftime('%Y-%m-%dT%H:%M:%S.%3NZ')}"
    # return UTC time in format: 2012-08-20T13:24:59+0000
    #"#{to_time(:utc).strftime('%Y-%m-%dT%H:%M:%S%z')}"
    # return time in current zone in format: 2012-08-20T09:26:47-0400
    #"#{to_time.strftime('%Y-%m-%dT%H:%M:%S%z')}"
  end
end

class DateTime
  def as_json(options = nil) #:nodoc:
    # return UTC time in Javascript format, e.g. "2012-08-12T04:00:00.000Z"
    "#{utc.strftime('%Y-%m-%dT%H:%M:%S.%3NZ')}"
    # return UTC time in format: 2012-08-20T13:24:59+0000
    #"#{utc.strftime('%Y-%m-%dT%H:%M:%S%z')}"
    # return time in current zone in format: 2012-08-20T09:26:47-0400
    #"#{strftime('%Y-%m-%dT%H:%M:%S%z')}"
  end
end
