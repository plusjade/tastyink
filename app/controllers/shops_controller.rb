class ShopsController < ApplicationController
  layout :configure_layout
  before_filter :require_user, :except => [:index, :show]
  
   
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

  # shops are created internally when creating a User!
  # GET /shops/new
  #def new
  #end


  # GET /shops/1/edit
  def edit
    @shop = current_user.shop
    render :template =>
      'shops/edit',
      :layout => false,
      :locals => {:shop => @shop} if request.xhr?
  end


  # PUT /shops/1
  def update
    @shop = current_user.shop
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
    @shop = current_user.shop
    return attach_helper(@shop)
  end 
  
  
  def detach
    render :nothing => true and return if params[:asset].nil?
    @shop = current_user.shop
    return detach_helper(@shop)
  end



end
