;$(document).ready(function(){
  var loading = '<div class="loading">Loading...</div>';
  $hProfile = $('#the-workspace div.working-profile');
  $hAssets  = $('#the-workspace div.working-assets');

  /* return the resource type and id or false
   * @return Array or false 
   */    
  function getResource(){
    var resource = $('img', $wProfile).attr('id');
    if(undefined == resource){ alert('Add a profile to the workspace'); return false };
    return resource.split('_');
  };
  
  /* collect working assets
   * @param resource = Array
   * @param complain = bool 
   */
  function saveAssets(resource, complain){
	  var ids = [];
	  //Note: this only saves new assets.
	  // TODO: add positioning.
	  $("img.is-new", $wAssets).each(function(){
	    ids.push(this.id.split('_')[1]);
    });
    if(ids.length <= 0){
      if(complain) alert('No New Images in the Workspace');
      return false;
    }    
    $(document).trigger('submitting');
    $.get('/' + resource[0] + '/' + resource[1] + '/attach',
      $.param({asset: ids}),
      function(rsp){
        $(document).trigger('responding', rsp);
        if('good' == rsp.status)
          $("img.is-new", $wAssets).removeClass('is-new');
      }
    );
  };
   
  // activate tab navigation
  $('ul.main-tabs li a').click(function(){
    $('div.tab-content').hide();
    $('ul.main-tabs li a').removeClass('active');
    $(this).addClass('active');
    $('div#'+ $(this).attr('rel')).show();
    return false;
  });

  
/* edit profiles
----------------------------------- */ 

  $('body').dblclick($.delegate({
  
    // edit profiles via facebox
    '.drag-profile img, .shop-each img' : function(e){
      var profile = $(e.target).attr('id');
	    if(undefined == profile){alert('profile id was not found'); return false};
	    profile = profile.split('_');
	    $hAssets.empty();
	    $hProfile.empty();
	    $(e.target).clone().appendTo($hProfile);
      $.getJSON('/' + profile[0] + '/' + profile[1] + '.json', function(rsp) {
        $.each(rsp[profile[0].slice(0, -1)].assets, function(){
          $hAssets.append(assetsWorkTemplate(this));
        });
        $.facebox({ div: '#the-workspace' }, 'workspace-wrapper');
      });
      return false;
    }
    
  }));
 

/* resource interactions
----------------------------------- */
  // tattoo resources are loadable.  
  $('ul.artists-list li a').click(function(){
    $('ul.tattoos-wrapper').html(loading);
    $.get(this.href + '.json',function(rsp){
      $('ul.tattoos-wrapper').empty();
      $.each(rsp, function(){
        this.tattoo.src = (this.tattoo.assets.length <= 0)
          ? '/images/no-image.gif'
          : '/system/datas/' + this.tattoo.assets[0].id +'/thumb/'+ this.tattoo.assets[0].data_file_name;
        $('ul.tattoos-wrapper').append(tattoosTemplate(this.tattoo));
      });
      $(document).trigger('draggableProfiles');
    });
    return false;
  });

  // refresh asset resources container
  $('a.refresh-assets').click(function(){
    $('ul.assets-wrapper').empty();
    $.getJSON(this.href + '.json', function(rsp){
      $.each(rsp, function(){
        $('ul.assets-wrapper').append(assetsReTemplate(this.asset));
      });
      $(document).trigger('draggableAssets');
    });
    return false;
  });

 
/* click delegations
----------------------------------- */
  $('body').click($.delegate({
  
   // "save" working assets to working profile resource.
    'a.attach-assets' : function(e){
      var resource = getResource(); if(!resource) return false;
      saveAssets(resource, true);
      return false;
    },

   // clear the unsaved working assets
    'a.clear-assets' : function(e){
      $('img.is-new', $wAssets).remove();
      $('li.save a, li.clear a', 'ul.workspace-toolbar').addClass('disable');
      return false;
    },
   
   // "edit details" of the working profile resource.
    'a.edit-details' : function(e){
      var resource = getResource(); if(!resource) return false;
      $('#facebox div.working-details').html(loading);
      $.get('/' + resource[0] + '/' + resource[1] + '/edit',
        function(view){
          $('#facebox div.working-details').html(view);
          $(document).trigger('ajaxify.form');
        });
      return false;
    },
  

   // disable clicking on tattoo profiles.
    'ul.tattoos-wrapper a' : function(e){
      return false;
    },
    'ul.tattoos-wrapper a img' : function(e){
      $(e.target).parent('a').click();
      return false;
    },
    
    
    // hide the asset panel
    "div.asset-panel a.hide": function(e) {
      $('div.dialog_wrapper').toggle();      
      if('hide'== $(e.target).html()){
        $(e.target).html('show images');
        $('div.asset-panel').css('top', $.getPageHeight()- 32);
      }else{
        $('div.asset-panel').css('top', $.getPageHeight()- 300);
        $(e.target).html('hide')
      }
      return false;
    }
    
         
  }));




/* bindings 
------------------------------- 
------------------------------- */

  // make working assets container droppable
  $(document).bind('droppableAssets', function(){
    $wAssets.droppable({
      accept: '.drag-asset',
      activeClass: 'ui-state-highlight',
      hoverClass: 'drophover',
      tolerance: 'touch',
      drop: function(e, ui) {
        $(ui.draggable).addClass('is-working');
        if(undefined != $('img:first', $wAssets).attr('src')){
          $('ul.workspace-toolbar li.clear a').removeClass('disable');
	        if(undefined != $('img', $wProfile).attr('id'))
            $('ul.workspace-toolbar li.save a').removeClass('disable');
        }
      }
    });
  });

  // make working assets sortable.
  $(document).bind('wAssetsSortable', function(){
    $wAssets.sortable({
      items: 'img',
      forceHelperSize: true,
      forcePlaceholderSize: true,
      placeholder: 'sortable-placeholder'
    });
  });  

  // make super trashcan droppable
  $(document).bind('superTrash', function(){
    $('li.super-trash').droppable({
      accept: '.drag-profile', //.drag-asset cannot delete images yet 
      activeClass: 'ui-state-highlight',
      hoverClass: 'drophover',
      tolerance: 'touch',
      drop: function(e, ui) {
        if($(ui.draggable).hasClass('drag-profile')){
          // is profile
          var profile = $('img:first',$(ui.draggable)).attr('id');

        }else if($(ui.draggable).hasClass('drag-asset')){
          // asset
          var profile = $(ui.draggable).attr('id');
          
          $(ui.draggable).parent().remove();
        }
        profile = profile.split('_');
        console.log(profile);
        $.ajax({
          type: 'DELETE',
          dataType:'json',
          url: '/' + profile[0] + '/' + profile[1],
          beforeSend: function(){
            if(!confirm('Sure you want to delete?')) return false;
            $(document).trigger('submitting');
          },
          success: function(rsp){
            $(document).trigger('responding', rsp);
            console.log(rsp);
            $(ui.draggable).remove();
            $(ui.helper).remove();
          }
        });

        
      }
    });
  }); 
      
  // make trashcan droppable
  $(document).bind('droppableTrash', function(){
    $('div.trashcan').droppable({
      accept: '#facebox .drag-asset',
      activeClass: 'ui-state-highlight',
      hoverClass: 'drophover',
      tolerance: 'touch',
      drop: function(e, ui) {
        // is profile
        if($(ui.draggable).hasClass('drag-profile')){
          console.log('ruhoh remove profile!');
          $(ui.draggable).remove();
          return;
        }
        // is new non-attached asset
        if($(ui.draggable).hasClass('is-new')){
          if($(ui.draggable).hasClass('is-working')){
            console.log('no big');
          }else{
            console.log('removed asset from resources!');
          }
          $(ui.draggable).remove();
          return;
        }
        // detach from working profile.
        var resource = $('img', $wProfile).attr('id').split('_');
        var asset = $(ui.draggable).attr('id').split('_');
        $.getJSON('/' + resource[0] + '/' + resource[1] + '/detach',
          {asset: asset[1]},
          function(rsp){
            $(document).trigger('responding', rsp);
            $(ui.draggable).remove();
          }
        );
      }
    });
  });  
  
  // make asset resources draggable
  $(document).bind('draggableAssets', function(){
    $("ul.assets-wrapper li img").draggable({
      appendTo: 'body',
      cursorAt: {top:30, left:30},
      stack: "ul.assets-wrapper li img",
      zIndex: 999999999,
      revert: true,
      helper: 'clone',
      connectToSortable: '#facebox div.working-assets'
    });
  });

  // make shop/artist/tattoo resources draggable.  
  $(document).bind('draggableProfiles', function(){
    $(".drag-profile").draggable({
      appendTo: 'body',
      handle: 'img',
      stack: ".drag-profile",
      zIndex: 2700,
      revert: true
    });  
  }); 
      
  // ajaxify the forms
  $(document).bind('ajaxify.form', function(){
    $('form').ajaxForm({     
      beforeSubmit: function(fields, form){
        if(! $("input", form[0]).jade_validate() ) return false;
        if('no_disable' != $(form[0]).attr('rel')) $('button', form[0]).attr('disabled','disabled').removeClass('jade_positive');
        $(document).trigger('submitting');
      },
      success: function(rsp) {
        console.log(rsp);
        if(undefined != rsp.created){       
          var data = '<img src="/images/no-image.gif" id="'+ rsp.created.resource +'_'+ rsp.created.id +'"/>' + rsp.created.resource ;
          $hAssets.empty();
          $hProfile.html(data); 
          $.facebox({ div: '#the-workspace' }, 'workspace-wrapper');
        }
        $(document).trigger('responding', rsp);
        $('.facebox form button').removeAttr('disabled').addClass('jade_positive');
      }
    });
  });

  // bind facebox functions  
  $(document).bind('reveal.facebox', function(){
    //$('body').addClass('disable_body').attr('scroll','no');
    $wAssets  = $('#facebox div.working-assets');
    $wProfile = $('#facebox div.working-profile');
    $(document).trigger('wAssetsSortable');
    $(document).trigger('droppableTrash');
    $(document).trigger('ajaxify.form');
  });

  // Bind functions to the CLOSE facebox event.
  $(document).bind('close.facebox', function() {
    //$('body').removeClass('disable_body').removeAttr('scroll');
  });

  // show the submit ajax loading graphic.
  $(document).bind('submitting', function(){
    $('div.responding.active').remove();
    $('div.submitting').show();
  });

  // show the response (always json)
  $(document).bind('responding', function(e, rsp){
    var status = (undefined == rsp.status) ? 'bad' : rsp.status;
    var msg = (undefined == rsp.msg) ? 'There was a problem!' : rsp.msg;
    $('div.submitting').hide();
    $('div.responding.active').remove();
    $('div.responding')
      .clone()
      .addClass('active ' + status)
      .html(msg)
      .show()
      .insertAfter('.responding');
    setTimeout('$(".responding.active").fadeOut(4000)', 1900);  
  });

}); //end

// Adapted from getPageSize() by quirksmode.com
jQuery.getPageHeight = function() {
	var windowHeight;
	if (self.innerHeight) { windowHeight = self.innerHeight; }
	else if (document.documentElement && document.documentElement.clientHeight) {windowHeight = document.documentElement.clientHeight;}
	else if (document.body) { windowHeight = document.body.clientHeight;}	
	return windowHeight
};
// getPageScroll() by quirksmode.com
jQuery.getPageScroll = function() {
	var xScroll, yScroll;
	if (self.pageYOffset) { yScroll = self.pageYOffset; xScroll = self.pageXOffset; }
	else if (document.documentElement && document.documentElement.scrollTop) { yScroll = document.documentElement.scrollTop; xScroll = document.documentElement.scrollLeft;} 
	else if (document.body) { yScroll = document.body.scrollTop; xScroll = document.body.scrollLeft;}
	return new Array(xScroll,yScroll) 
};
