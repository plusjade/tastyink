class Shop < ActiveRecord::Base
   has_many :artists
   has_many :tattoos
   acts_as_polymorphic_paperclip :counter_cache => true
end
