class TattoosController < ApplicationController
  layout :configure_layout
  
  # GET /posts
  def index

    respond_to do |format|
    
      format.html do
        if ( params[:shop_id] ) 
          redirect_to shop_path(params[:shop_id])
        end
        if ( params[:artist_id] )
          redirect_to artist_path(params[:artist_id])
        end
      end
      
      format.json do
        if ( params[:shop_id] ) 
          @shop = Shop.find(params[:shop_id], :include => :tattoos)
          render :json => @shop.tattoos.to_json(:include => { :assets => { :only => [:id, :data_file_name] } })
      
          return
        else
          if ( params[:artist_id] )
            @artist = Artist.find(params[:artist_id], :include => [:tattoos])
            render :json => @artist.tattoos.to_json(:include => { :assets => { :only => [:id, :data_file_name] } })
      
            return
          else
            render :json => []
          end
        end 
      end 
       
    end
  end

  # GET /tattoos/1
  def show
    respond_to do |format|
      format.html do
        @tattoo = Tattoo.find(params[:id], :include => [:shop, :artist])
        @artist = @tattoo.artist
        @shop   = @tattoo.shop  
      end
      format.json do
        @tattoo = Tattoo.find(params[:id])
        render :json => @tattoo.to_json(:include => [:artist, :assets])
        # render :json => @tattoo
        # render :json => @tattoo.to_json(:include => { :photos => { :only => [:id, :url] } })
      
      end
    end
  end




  # GET /tattoos/new
  def new
  
    if params[:shop_id].nil?
      render :text => 'specify shop'
      return
    end
    
    @shop = Shop.find(params[:shop_id])
    @tattoo = Tattoo.new
     
  end


  # GET /tattoos/1/edit
  def edit
    @tattoo = Tattoo.find(params[:id], :include => [:shop, :artist])
  end
  
  
  # POST /tattoos
  def create
    # todo: validate the shop_id
    if params[:shop_id].nil?
      render :text => 'specify shop'
      return
    end
    
    @tattoo = Tattoo.new(params[:tattoo])
    @tattoo.shop_id = params[:shop_id]
    
    respond_to do |format|
      if @tattoo.save
        flash[:notice] = 'Post was successfully created.'
        format.html { redirect_to(@tattoo) }
      else
        format.html { render :text => "failed" }
      end
    end
  end
  
  
  # PUT /tattoos/1
  def update

    @tattoo = Tattoo.find(params[:id])
    # @tattoo.data = params[:tattoo['data']]
    
    respond_to do |format|
      if @tattoo.update_attributes(params[:tattoo])
        flash[:notice] = 'Post was successfully updated.'
        format.html { redirect_to(@tattoo) }
      else
        format.html { render :action => "edit" }
      end
    end
  end


  # DELETE /tattoos/1
  def destroy
    @tattoo = Tattoo.find(params[:id])
    @tattoo.destroy

    respond_to do |format|
      format.html { redirect_to(shops_url) }
      format.xml  { head :ok }
    end
  end


end
