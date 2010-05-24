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
  
end
