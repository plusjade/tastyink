class Artist < ActiveRecord::Base
  belongs_to :shop
  has_many :tattoos
  acts_as_polymorphic_paperclip :counter_cache => true
end
