class Ability
  include CanCan::Ability

  def initialize(user)
    can :manage, :all unless user.nil?
  end
end
