class User < ActiveRecord::Base
  acts_as_authentic
  has_one :shop
  after_create :add_shop
  
  def add_shop
    @shop = self.build_shop
    @shop.save
  end
  
end
