class AdminController < ApplicationController

  before_filter :require_user
   
  def index
    @shop = current_user.shop
    @assets = Asset.find(:all)
  end

end
