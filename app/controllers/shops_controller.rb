class ShopsController < ApplicationController
  layout :configure_layout
  
  
  # GET /shops
  # GET /shops.xml
  def index
    @shops = Shop.find(:all)
    render :template => 'shops/index', :layout => 'home'
  end

  # GET /shops/1
  # GET /shops/1.xml
  def show
    @shop = Shop.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render :json => @shop.to_json(:include => :assets) }
    end
  end



  # GET /shops/new
  # GET /shops/new.xml
  def new
    @shop = Shop.new

    respond_to do |format|
      format.html # new.html.erb
    end
  end

  # GET /shops/1/edit
  def edit
    @shop = Shop.find(params[:id])
  end

  # POST /shops
  # POST /shops.xml
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
  # PUT /shops/1.xml
  def update
    @shop = Shop.find(params[:id])

    respond_to do |format|
      if @shop.update_attributes(params[:shop])
        flash[:notice] = 'Shop was successfully updated.'
        format.html { redirect_to(@shop) }
      else
        format.html { render :action => "edit" }
      end
    end
  end

  # DELETE /shops/1
  # DELETE /shops/1.xml
  def destroy
    @shop = Shop.find(params[:id])
    @shop.destroy

    respond_to do |format|
      format.html { redirect_to(shops_url) }
    end
  end
end
