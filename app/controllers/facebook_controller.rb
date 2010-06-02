class FacebookController < ApplicationController
  # we need this because all ajax calls are via POST.
  skip_before_filter :verify_authenticity_token
  
  
  # init iframe application page.
  def index
    @shop = Shop.find(1)
    render :json => @shop
    return
  end


  # init profile tab fbml page.
  def profile
     @shop = Shop.find(1)
     render :template => 'facebook/profile.erb', :layout => false
     return
  end  


  # get shop json and/or all tattoos from shop
  def shops
    render :nothing => true and return if params[:id].nil?
    
    if ( params[:meta] == 'tattoos' )
      @shop = Shop.find(params[:id], :include => :tattoos)
      render :json => @shop.tattoos.to_json(:include => { :assets => { :only => [:id, :data_file_name] } })
      return
    end
    
    @shop = Shop.find(params[:id])
    render :json => @shop.to_json(:include => :assets)
  end
   


  # get artist json and/or all tattoos from artist.
  def artists
    render :nothing => true and return if params[:id].nil?

    if ( params[:meta] == 'tattoos' )
      @artist = Artist.find(params[:id], :include => :tattoos)
      render :json => @artist.tattoos.to_json(:include => { :assets => { :only => [:id, :data_file_name] } })
      return
    end
        
    @artist = Artist.find(params[:id])
    render :json => @artist.to_json(:include => :assets)
  end
  
      



  # get a single tattoo 
  def tattoos
    render :nothing => true and return if params[:id].nil?

    @tattoo = Tattoo.find(params[:id])
    render :json => @tattoo.to_json(:include => [:artist, :assets])
    #render :json => @tattoo.to_json(:include => { :assets => { :only => [:id, :data_file_name] } })
    return
  end


  
end
