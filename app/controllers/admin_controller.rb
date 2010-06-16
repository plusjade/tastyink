class AdminController < ApplicationController

  before_filter :require_user
   
  def index
    @shop = current_user.shop
    @assets = Asset.find(
      :all,
      :conditions => { :shop_id => current_user.shop.id }
    )
  end

end
