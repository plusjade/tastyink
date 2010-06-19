class TattoosController < ApplicationController
  layout :configure_layout
  before_filter :require_user, :except => [:index, :show]
  
  
  # GET /posts
  def index
    render :nothing => true and return if params[:shop_id].nil? and params[:artist_id].nil?
    
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
      end
    end
  end

  
  # GET /tattoos/new
  def new
    @shop = current_user.shop
    @tattoo = Tattoo.new
    render :template => 
      'tattoos/new',
      :layout => false,
      :locals => {:tattoo => @tattoo} if request.xhr?
  end


  # GET /tattoos/1/edit
  def edit
    @tattoo = Tattoo.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
    render :template => 
      'tattoos/edit',
      :layout => false,
      :locals => {:tattoo => @tattoo} if request.xhr?
  end
  
  
  # POST /tattoos
  def create
    @tattoo = Tattoo.new(params[:tattoo])
    @tattoo.shop_id = current_user.shop.id
    
    if @tattoo.save
      render :json => 
      {
        'status'  => 'good',
        'msg'     => 'Tattoo created!',
        'created' => { 'resource' => 'tattoos', 'id' => @tattoo.id }
      }
    else
      render :json => 
      {
        'status' => 'bad',
        'msg'    => "Oops! Please try again!"
      }
    end
  end
  
  
  # PUT /tattoos/1
  def update
    @tattoo = Tattoo.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
    if @tattoo.update_attributes(params[:tattoo])
      render :json => 
      {
        'status' => 'good',
        'msg'    => "Tattoo Updated!"
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
    @tattoo = Tattoo.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
    return attach_helper(@tattoo)
  end 
  
  
  def detach
    render :nothing => true and return if params[:asset].nil?
    @tattoo = Tattoo.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
    return detach_helper(@tattoo)
  end
 

  
  # DELETE /tattoos/1
  def destroy
    @tattoo = Tattoo.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
    if @tattoo.destroy
      render :json =>
      {
        "status" => 'good',
        'msg'    => 'Tattoo deleted!'
      }
    else
      render :json =>
      {
        "status" => 'bad',
        'msg'    => 'Problem deleting the tattoo'
      }    
    end
  end

  
end
