class ArtistsController < ApplicationController
  layout :configure_layout
  
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
    @shop = Shop.find(params[:shop_id])
    @artist = @shop.artists.build
    render :template => 
      'artists/new',
      :layout => false,
      :locals => {:artist => @artist} if request.xhr?
  end


  #POST
  def create
    @shop = Shop.find(params[:shop_id])
    @artist = @shop.artists.build(params[:artist])
    if @artist.save
      render :json => 
      {
        'status' => 'good',
        'msg'    => "Artist created!"
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
    @artist = Artist.find(params[:id])
    render :template =>
      'artists/edit',
      :layout => false,
      :locals => {:artist => @artist} if request.xhr?
  end


  def update
    @artist = Artist.find(params[:id])
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
    @artist = Artist.find(params[:id])
    return attach_helper(@artist)
  end 
  
  
  def detach
    render :nothing => true and return if params[:asset].nil?
    @artist = Artist.find(params[:id])
    return detach_helper(@artist)
  end
  
  
  def destroy
    @artist = Artist.find(params[:id])
    @artist.destroy

    render :json =>
    {
      "status" => 'good',
      'msg'    => 'Artist deleted!'
    }
  end

 
end

