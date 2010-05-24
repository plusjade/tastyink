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
    #@shop = Shop.find(params[:shop_id])
    #@artist = @shop.artists.find(params[:id])
  end

  # GET
  def new
    @shop = Shop.find(params[:shop_id])
    @artist = @shop.artists.build
  end

  #POST
  def create
    @shop = Shop.find(params[:shop_id])
    @artist = @shop.artists.build(params[:artist])
    if @artist.save
      redirect_to shop_artist_url(@shop, @artist)
    else
      render :action => "new"
    end
  end

  def edit
    @artist = Artist.find(params[:id])
  end


  def update
    @artist = Artist.find(params[:id])
    if @artist.update_attributes(params[:artist])
      redirect_to artist_url(@artist)
    else
      render :action => "edit"
    end
  end



  def destroy
    @artist = Artist.find(params[:id])
    @artist.destroy

    respond_to do |format|
      format.html { redirect_to artists_path }
      format.xml  { head :ok }
    end
  end


  
end

