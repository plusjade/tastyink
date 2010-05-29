class FacebookController < ApplicationController
  skip_before_filter :verify_authenticity_token
  
  
  def index
    @shop = Shop.find(1)
    render :json => @shop
    return
  end


  # init page for facebook profile tab
  def profile
     @shop = Shop.find(1)
     render :template => 'facebook/profile.erb', :layout => false
     return
  end  


  # get shop json
  def shop
    render :nothing => true and return if params[:id].nil?
    
    @shop = Shop.find(params[:id])
    render :json => @shop.to_json(:include => :assets)
    return
  end
   
    
  # get tattoos from shop json  
  def tattoos
    render :nothing => true and return if params[:id].nil?

    @shop = Shop.find(params[:id], :include => :tattoos)
    render :json => @shop.tattoos.to_json(:include => { :assets => { :only => [:id, :data_file_name] } })
    return
  end


  # get a single tattoo 
  def tattoo
    render :nothing => true and return if params[:id].nil?

    @tattoo = Tattoo.find(params[:id])
    render :json => @tattoo.to_json(:include => [:artist, :assets])
    #render :json => @tattoo.to_json(:include => { :assets => { :only => [:id, :data_file_name] } })
    return
  end


  
end
