class AssetsController < ApplicationController

  layout 'admin'
  
  
  # GET /assets
  def index
    render :text => 'specify shop' and return if params[:shop_id].nil? 
    @shop = Shop.find(params[:shop_id])
    @assets = Asset.find(:all)
    respond_to do |format|
      format.html
      format.json { render :json => @assets }
    end    
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
    @asset = Asset.find(params[:id])
  end


  # POST /assets
  def create
    render :json => {'msg' => 'Nothing sent.'} and return if params[:asset][:data].is_a?(String)    
    @asset = Asset.new(params[:asset])

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
    @asset = Asset.find(params[:id])

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
    @asset = Asset.find(params[:id])
    @asset.destroy

    render :json =>
    {
      "status" => 'good',
      'msg'    => 'Asset deleted!'
    }
  end
  
  
end
