class ShopsController < ApplicationController
  layout :configure_layout
  
  # GET /shops
  def index
    @shops = Shop.find(:all)
    render :template => 'shops/index', :layout => 'home'
  end


  # GET /shops/1
  def show
    @shop = Shop.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render :json => @shop.to_json(:include => :assets) }
    end
  end


  # GET /shops/new
  def new
    @shop = Shop.new

    respond_to do |format|
      format.html # new.html.erb
    end
  end


  # GET /shops/1/edit
  def edit
    @shop = Shop.find(params[:id])
    render :template =>
      'shops/edit',
      :layout => false,
      :locals => {:shop => @shop} if request.xhr?
  end


  # POST /shops
  def create
    @shop = Shop.new(params[:shop])

    respond_to do |format|
      if @shop.save
        flash[:notice] = 'Shop was successfully created.'
        format.html { redirect_to(@shop) }
      else
        format.html { render :action => "new" }
      end
    end
  end


  # PUT /shops/1
  def update
    @shop = Shop.find(params[:id])
    if @shop.update_attributes(params[:shop])
      render :json => 
      {
        'status' => 'good',
        'msg'    => "Shop Updated!"
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
    @shop = Shop.find(params[:id])
    return attach_helper(@shop)
  end 
  
  
  def detach
    render :nothing => true and return if params[:asset].nil?
    @shop = Shop.find(params[:id])
    return detach_helper(@shop)
  end
  
  
  # DELETE /shops/1
  def destroy
    @shop = Shop.find(params[:id])
    @shop.destroy

    render :json =>
    {
      "status" => 'good',
      'msg'    => 'Tattoo deleted!'
    }
  end
end
