class AdminController < ApplicationController
  
  # NOTE: authentication should store the shop object.
  def index
    @shop = Shop.find(1)
    @assets = Asset.find(:all)
  end

end
