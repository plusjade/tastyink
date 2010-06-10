# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def js_shop_template
    html = render(:file => 'shops/js-single')
    html.gsub("\n",'')
  end
  

  def js_artist_template
    html = render(:file => 'artists/js-single')
    html.gsub("\n",'')
  end
  

  def js_tattoo_template
    html = render(:file => 'tattoos/js-single')
    html.gsub("\n",'')
  end

  def js_tattoos_template
    html = render(:file => 'tattoos/js-gallery')
    html.gsub("\n",'')
  end

  def js_assets_template
    html = render(:file => 'assets/js-gallery')
    html.gsub("\n",'')
  end
    
  ## Facebook application templates
  ## TODO: dry this up.
  ## the main diff. as of now if just the URL to scope to fb controller.
  
  def fb_shop_template
    html = render(:file => 'shops/fb-single')
    html.gsub("\n",'')
  end
  

  def fb_artist_template
    html = render(:file => 'artists/fb-single')
    html.gsub("\n",'')
  end
  

  def fb_tattoo_template
    html = render(:file => 'tattoos/fb-single')
    html.gsub("\n",'')
  end

  def fb_tattoos_template
    html = render(:file => 'tattoos/fb-gallery')
    html.gsub("\n",'')
  end
  
end
