# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  # output the correct image path to first asset.
  def display_first_asset(assets)
    if assets.first.nil? 
      '/images/no-image.gif'
    else
      assets.first.url(:thumb)
    end  
  end
  
  
  def js_shop_template
    render(:file => 'shops/js-single').gsub("\n",'')
  end
  

  def js_artist_template
    render(:file => 'artists/js-single').gsub("\n",'')
  end
  

  def js_tattoo_template
    render(:file => 'tattoos/js-single').gsub("\n",'')
  end


  def js_tattoos_template
    render(:file => 'tattoos/js-gallery').gsub("\n",'')
  end


  def admin_resource_template
    render(:file => 'assets/admin-resource').gsub("\n",'')
  end

  def admin_working_template
    render(:file => 'assets/admin-working').gsub("\n",'')
  end
  
  def admin_tattoos_template
    render(:file => 'tattoos/admin-gallery').gsub("\n",'')
  end

  def admin_artists_template
    render(:file => 'artists/admin-gallery').gsub("\n",'')
  end
  
        
  ## Facebook application templates
  ## TODO: dry this up.
  ## the main diff. as of now if just the URL to scope to fb controller.
  
  def fb_shop_template
    render(:file => 'shops/fb-single').gsub("\n",'')
  end
  

  def fb_artist_template
    render(:file => 'artists/fb-single').gsub("\n",'')
  end
  

  def fb_tattoo_template
    render(:file => 'tattoos/fb-single').gsub("\n",'')
  end


  def fb_tattoos_template
    render(:file => 'tattoos/fb-gallery').gsub("\n",'')
  end
  
  
end
