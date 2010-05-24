class Tattoo < ActiveRecord::Base
  belongs_to :shop
  belongs_to :artist
  acts_as_polymorphic_paperclip :counter_cache => true
  # attr_accessible :data

end
