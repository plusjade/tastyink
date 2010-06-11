;$(document).ready(function(){
  // activate tab navigation
  $('ul.main-tabs li a').click(function(){
    $('div.tab-content').hide();
    $('ul.main-tabs li a').removeClass('active');
    $(this).addClass('active');
    $('div#'+ $(this).attr('rel')).show();
    return false;
  });

  // working profile is droppable
  $(".working-profile").droppable({
    accept: '.drag-profile',
    activeClass: 'ui-state-highlight',
    hoverClass: 'drophover',
    tolerance: 'touch',
    drop: function(e, ui) {
      $('span', this).html($(ui.draggable).html());
    }
  }); 

  // working assets container is droppable
  $("ul.working-assets").droppable({
    accept: '.drag-asset',
    activeClass: 'ui-state-highlight',
    hoverClass: 'drophover',
    tolerance: 'touch'
  });

  // working assets are sortable.
  $("ul.working-assets").sortable({
    items: 'img',
    forceHelperSize: true,
    forcePlaceholderSize: true,
    placeholder: 'sortable-placeholder'
  });

  // shop/artists profiles are draggable.  
  $(".drag-profile").draggable({
    appendTo: 'body',
    handle: 'img',
    stack: ".drag-profile",
    zIndex: 2700,
    revert: true
  });  

/* click functions
----------------------------------- */
  // "save" assets-to-profile attachments.
  $('a.attach-assets').click(function(){
	  var profile = $('div.working-profile img').attr('id');
	  if(undefined == profile){
	    alert('Add a profile to the workspace'); return false
	  };
	  var ids = [];
	  $("ul.working-assets img").each(function(){
	    ids.push(this.id.replace('asset_',''));
    });
    if(ids.length <= 0){
      alert('Add images to the workspace'); return false;
    }
    profile = profile.split('_');
    //console.log(profile); console.log(ids); return false;
    $(document).trigger('submitting');
    $.get('/' + profile[0] + '/' + profile[1] + '/attach',
      $.param({asset: ids}),
      function(rsp){
        $(document).trigger('responding', rsp);  
    });
    return false;
  });

  // clear the working assets
  $('a.clear-assets').click(function(){
    $('ul.working-assets').empty();
    return false;
  });

  // "edit" a profile 
  $('a.edit-profile').click(function(){
	  var profile = $('div.working-profile img').attr('id');
	  if(undefined == profile){
	    alert('Add a profile to the workspace'); return false
	  };
	  profile = profile.split('_');
    $.facebox(function() {
      $.get('/' + profile[0] + '/' + profile[1] + '/edit',
        function(data) { $.facebox(data) });
    });
    return false;
  });

  // tattoo profiles are loadable.  
  $('ul.artists-list li a').click(function(){ 
    $('ul.tattoos-wrapper').empty();
    $.get(this.href + '.json',function(rsp){
      $.each(rsp, function(){
        this.tattoo.src = (this.tattoo.assets.length <= 0)
          ? '/images/no-image.gif'
          : '/system/datas/' + this.tattoo.assets[0].id +'/thumb/'+ this.tattoo.assets[0].data_file_name;
        $('ul.tattoos-wrapper').append(tattoosTemplate(this.tattoo));
      });
      $(document).trigger('draggableTattoos');
    });
    return false;
  });

  // refresh asset container
  $('a.refresh-assets').click(function(){
    $('ul#assets-wrapper').empty();
    $.getJSON(this.href + '.json', function(rsp){
      $.each(rsp, function(){
        $('ul#assets-wrapper').append(assetsTemplate(this.asset));
      });
      $(document).trigger('draggableAssets');
    });
    return false;
  });

/* click delegations
----------------------------------- */
  $('body').click($.delegate({
   // disable clicking on tattoo profiles.
    'ul.tattoos-wrapper a' : function(e){
      return false;
    },
      'ul.tattoos-wrapper a img' : function(e){
        $(e.target).parent('a').click();
        return false;
      },
      
    // detach command
    'ul#profile-assets-wrapper a' : function(e){
      $(document).trigger('submitting'); 
      $.getJSON(e.target.href, function(rsp){
        $(document).trigger('responding', rsp);
        $(e.target).parent().remove();
      });
      return false;
    }
  }));

  /*
  // selectable list entries
  $(".selectable").selectable({
    filter : 'li',
    stop: function(event, ui) {
      var count = 0;
		  $(".ui-selected", this).each(function(){
			  count += 1;
      });
      console.log(count + ' items');
    }  
  });
  */

/* bindings 
------------------------------- */
  // make assets draggable
  $(document).bind('draggableAssets', function(){
    $("ul#assets-wrapper li img").draggable({
      appendTo: 'body',
      stack: "ul.assets-wrapper li img",
      zIndex: 2700,
      revert: true,
      helper: 'clone',
      connectToSortable: 'ul.working-assets'
    });
  });

  // make tattoo profiles draggable.
  $(document).bind('draggableTattoos', function(){
    $("ul.tattoos-wrapper li").draggable({
      appendTo: 'body',
      handle: 'img',
      stack: "ul.tattoos-wrapper li",
      zIndex: 2700,
      revert: true
    });
  });

  // ajaxify the forms
  $(document).bind('ajaxify.form', function(){
    $('form').ajaxForm({     
      beforeSubmit: function(fields, form){
        if(! $("input", form[0]).jade_validate() ) return false;
        if('no_disable' != $(form[0]).attr('rel'))
          $('button', form[0])
          .attr('disabled','disabled')
          .removeClass('jade_positive');
        $(document).trigger('submitting');
      },
      success: function(rsp) {
        console.log(rsp);
        $('.facebox form button')
        .removeAttr('disabled')
        .addClass('jade_positive');
        $(document).trigger('responding', rsp);
      }
    });
  });

  // bind facebox functions  
  $(document).bind('reveal.facebox', function(){
    //$('body').addClass('disable_body').attr('scroll','no');
    $(document).trigger('ajaxify.form');
  });

  // Bind functions to the CLOSE facebox event.
  $(document).bind('close.facebox', function() {
    //$('body').removeClass('disable_body').removeAttr('scroll');
  });

  // show the submit ajax loading graphic.
  $(document).bind('submitting', function(){
    $('#top-container .responding.active').remove();
    $('#top-container .submitting').show();
  });

  // show the response (always json)
  $(document).bind('responding', function(e, rsp){
    var status = (undefined == rsp.status) ? 'bad' : rsp.status;
    var msg = (undefined == rsp.msg) ? 'There was a problem!' : rsp.msg;
    $('#top-container .responding.active').remove();
    $('#top-container .submitting').hide();
    $('#top-container .responding')
      .clone()
      .addClass('active ' + status)
      .html(msg)
      .show()
      .insertAfter('.responding');
    setTimeout('$(".responding.active").fadeOut(4000)', 1900);  
  });

}); //end
