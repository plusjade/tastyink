# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time


    
  # See ActionController::RequestForgeryProtection for details
  # Uncomment the :secret if you're not using the cookie session store
  protect_from_forgery # :secret => '1e2074d45c182ed5f3743d8d17ccd9c7'
  
  # See ActionController::Base for details 
  # Uncomment this to filter the contents of submitted sensitive data parameters
  # from your application log (in this case, all fields with names like "password"). 
  # filter_parameter_logging :password
  

  def configure_layout
    ( ['show'].include? action_name ) ? 'shop' : 'admin' 
  end
  

  # helper for attaching assets to a profile.
  def attach_helper(profile)
    tally = 0
    params[:asset].each do |asset|
      @asset = Asset.find(asset)
      next if @asset.nil?
      tally += 1 if profile.assets.attach(@asset)
    end

    render :json =>
    {
      'status' => 'good',
      'msg'    => "attached #{tally} images"
    }  
  end


  # helper for detaching assets to a profile.
  def detach_helper(profile)
    tally = 0
    params[:asset].each do |asset|
      @asset = Asset.find(asset)
      next if @asset.nil?
      tally += 1 if profile.assets.detach_quick(@asset)
    end
    
    render :json =>
    {
      'status' => 'good',
      'msg'    => "detached #{tally} images"
    }  
  end
  
 
end
