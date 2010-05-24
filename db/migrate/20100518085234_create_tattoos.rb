class CreateTattoos < ActiveRecord::Migration
  def self.up
    create_table :tattoos do |t|
      t.string :title
      t.text :desc
      t.references :artist

      t.timestamps
    end
  end

  def self.down
    drop_table :tattoos
  end
end
