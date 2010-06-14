class ArtistsController < ApplicationController
  layout :configure_layout
  before_filter :require_user, :except => [:index, :show]
    
  def index
    @shop = Shop.find(params[:shop_id])
    @artists = @shop.artists
  end


  def show
    respond_to do |format|
      format.html do
        @artist = Artist.find(params[:id], :include => :shop)
        @shop   = @artist.shop      
      end
      format.json do
        @artist = Artist.find(params[:id])
        render :json => @artist.to_json(:include => :assets)
      end
    end
  end


  # GET
  def new
    @shop = current_user.shop
    @artist = @shop.artists.build
    render :template => 
      'artists/new',
      :layout => false,
      :locals => {:artist => @artist} if request.xhr?
  end


  #POST
  def create
    @shop = current_user.shop
    @artist = @shop.artists.build(params[:artist])
    if @artist.save
      render :json =>
      {
        'status'  => 'good',
        'msg'     => 'Artist created!',
        'created' => { 'resource' => 'artists', 'id' => @artist.id }
      }
    else
      render :json => 
      {
        'status' => 'bad',
        'msg'    => "Oops! Please try again!"
      }
    end
  end


  def edit
    @artist = Artist.find(
      params[:id], 
      :conditions => { :shop_id => current_user.shop.id }
    )
    render :template =>
      'artists/edit',
      :layout => false,
      :locals => {:artist => @artist} if request.xhr?
  end


  def update
    @artist = Artist.find(
      params[:id], 
      :conditions => { :shop_id => current_user.shop.id }
    )
    if @artist.update_attributes(params[:artist])
      render :json => 
      {
        'status' => 'good',
        'msg'    => "Artist Updated!"
      }
    else
      render :json => 
      {
        'status' => 'bad',
        'msg'    => "Oops! Please try again!"
      }
    end
  end


  def attach
    render :nothing => true and return if params[:asset].nil?
    @artist = Artist.find(
      params[:id], 
      :conditions => { :shop_id => current_user.shop.id }
    )
    return attach_helper(@artist)
  end 
  
  
  def detach
    render :nothing => true and return if params[:asset].nil?
    @artist = Artist.find(
      params[:id], 
      :conditions => { :shop_id => current_user.shop.id }
    )
    return detach_helper(@artist)
  end
  
  
  def destroy
    @artist = Artist.find(
      params[:id], 
      :conditions => { :shop_id => current_user.shop.id }
    )
    @artist.destroy
    render :json =>
    {
      "status" => 'good',
      'msg'    => 'Artist deleted!'
    }
  end

 
end

