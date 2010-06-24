class AssetsController < ApplicationController
  layout 'admin'
  before_filter :require_user
  #skip_before_filter :verify_authenticity_token
  
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
    @shop = current_user.shop
  end


  # GET /assets/1/edit
  def edit
    @asset = Asset.find(
      params[:id],
      :conditions => { :shop_id => current_user.shop.id }
    )
  end


  # POST /assets
  # normal form accepts: params[:asset][:data]
  def create
    render :json => {'msg' => 'Nothing sent.'} and return if params[:Filedata].is_a?(String)
    h = Hash.new
    h[:asset] = Hash.new
    h[:asset][:data] = params[:Filedata]
    h[:asset][:data].content_type = MIME::Types.type_for(h[:asset][:data].original_filename).to_s

    @asset = Asset.new(h[:asset])
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
