class Tattoo < ActiveRecord::Base
  belongs_to :shop
  belongs_to :artist
  acts_as_polymorphic_paperclip :counter_cache => true

  validates_presence_of :title
  validates_numericality_of :artist_id, :only_integer => true
end
