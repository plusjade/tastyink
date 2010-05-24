class CreateShops < ActiveRecord::Migration
  def self.up
    create_table :shops do |t|
      t.string :name
      t.text :address
      t.text :desc
      t.string :phone
      t.text :hours

      t.timestamps
    end
  end

  def self.down
    drop_table :shops
  end
end
