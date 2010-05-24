class UpdateTattoosImageFields < ActiveRecord::Migration
  def self.up
  
    change_table :tattoos do |t|
      # i messed this up but we'll hack it up...
      #t.remove :image_file_name, :image_content_type, :image_file_size, :image_updated_at
      t.remove :image_updated_at
      t.integer :assets_count, :default => 0
    end  
  
  end

  def self.down
    change_table :tattoos do |t|
      t.add :image_file_name, :image_content_type, :image_file_size, :image_updated_at
      t.remove :assets_count
    end  
  end
end
