class UpdateArtistsTableForImages < ActiveRecord::Migration
  def self.up
    change_table :artists do |t|
      t.integer :assets_count, :default => 0
    end   
  end

  def self.down
    change_table :artists do |t|
      t.remove :assets_count, :default => 0
    end  
  end
end
