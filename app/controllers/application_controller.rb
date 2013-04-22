class ApplicationController < ActionController::Base

  protect_from_forgery

  before_filter :authenticate_user!

  def debug_request
    p request.headers
  end

  def can_view?(object)
    true
  end

  def admin?
    true
  end

  helper_method :can_view?
  helper_method :admin?
end
