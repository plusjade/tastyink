class AssetsController < ApplicationController
  layout 'admin'
  before_filter :require_user
  
  # GET /assets
  def index
    @assets = Asset.find(
      :all,
      :conditions => { :shop_id => current_user.shop.id }
    )
    render :json => @assets 
  end


  # GET /assets/1
  def show
    @asset = Asset.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render :json => @asset }
    end
  end


  # GET /assets/new
  def new
    @asset = Asset.new
    render :template => 
      'assets/new',
      :layout => false,
      :locals => {:asset => @asset} if request.xhr?
  end


  # GET /assets/1/edit
  def edit
    @asset = Asset.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
  end


  # POST /assets
  def create
    #render :json => {'msg' => 'Nothing sent.'} and return if params[:asset][:data].is_a?(String)    
    @asset = Asset.new(params[:asset])
    @asset.shop_id = current_user.shop.id
    
    if @asset.save
      render :json => 
      {
        'status' => 'good',
        'msg'    => "Asset Uploaded!"
      }
    else
      render :json =>
      {
        'status' => 'bad',
        'msg'    => "Oops! Please try again!"
      }
    end
  end


  # PUT /assets/1
  def update
    @asset = Asset.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
    if @asset.update_attributes(params[:shop])
      render :json => 
      {
        'status' => 'good',
        'msg'    => "asset Updated!"
      }
    else
      render :json => 
      {
        'status' => 'bad',
        'msg'    => "Oops! Please try again!"
      }
    end
  end


  # DELETE /assets/1
  def destroy
    @asset = Asset.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
    @asset.destroy

    render :json =>
    {
      "status" => 'good',
      'msg'    => 'Asset deleted!'
    }
  end
  
  
end
