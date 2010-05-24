class AddImageColumnsToTattoo < ActiveRecord::Migration
  def self.up
    add_column :tattoos, :image_file_name,    :string
    add_column :tattoos, :image_content_type, :string
    add_column :tattoos, :image_file_size,    :integer
    add_column :tattoos, :image_updated_at,   :datetime
  end

  def self.down
    remove_column :tattoos, :image_file_name
    remove_column :tattoos, :image_content_type
    remove_column :tattoos, :image_file_size
    remove_column :tattoos, :image_updated_at
  end
end
