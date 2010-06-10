# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100610083408) do

  create_table "artists", :force => true do |t|
    t.string   "name"
    t.text     "bio"
    t.text     "specialty"
    t.integer  "shop_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assets_count", :default => 0
  end

  create_table "assets", :force => true do |t|
    t.string   "data_file_name"
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.integer  "attachings_count",  :default => 0
    t.datetime "created_at"
    t.datetime "data_updated_at"
  end

  create_table "attachings", :force => true do |t|
    t.integer  "attachable_id"
    t.integer  "asset_id"
    t.string   "attachable_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "attachings", ["asset_id"], :name => "index_attachings_on_asset_id"
  add_index "attachings", ["attachable_id"], :name => "index_attachings_on_attachable_id"

  create_table "shops", :force => true do |t|
    t.string   "name"
    t.text     "address"
    t.text     "desc"
    t.string   "phone"
    t.text     "hours"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assets_count", :default => 0
  end

  create_table "tattoos", :force => true do |t|
    t.string   "title"
    t.text     "desc"
    t.integer  "shop_id",                     :null => false
    t.integer  "artist_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assets_count", :default => 0
  end

  create_table "users", :force => true do |t|
    t.string   "email",                              :null => false
    t.string   "crypted_password",                   :null => false
    t.string   "password_salt",                      :null => false
    t.string   "persistence_token",                  :null => false
    t.string   "single_access_token",                :null => false
    t.integer  "login_count",         :default => 0, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
