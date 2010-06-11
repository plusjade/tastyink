class AssetsBelongToShops < ActiveRecord::Migration
  def self.up
    change_table :assets do |t|
      t.references :shop
    end   
  end

  def self.down
    change_table :assets do |t|
      t.remove :shop_id
    end    
  end
end
