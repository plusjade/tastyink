class UpdateShopsTableForImages < ActiveRecord::Migration
  def self.up
    change_table :shops do |t|
      t.integer :assets_count, :default => 0
    end   
  end

  def self.down
    change_table :shops do |t|
      t.remove :assets_count, :default => 0
    end  
  end
end
