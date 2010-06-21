;$(document).ready(function(){
  var loading = '<div class="loading">Loading...</div>';
  $hProfile = $('#the-workspace div.working-profile');
  $hAssets  = $('#the-workspace div.working-assets');

  // activate tab navigation
  $('ul.main-tabs li a').click(function(){
    $('div.tab-content').hide();
    $('ul.main-tabs li a').removeClass('active');
    $(this).addClass('active');
    $('div#'+ $(this).attr('rel')).show();
    return false;
  });

/* refresh resources
----------------------------------- */

  // refresh artist resources container
  $('a.refresh-artists').click(function(){
    $('div.artists-wrapper').html(loading);
    $.getJSON(this.href, function(rsp){
      $('div.artists-wrapper').empty();
      $('ul.artists-list').empty();
      $.each(rsp, function(){
        this.artist.src = getFirstImage(this.artist.assets);
        $('div.artists-wrapper').append(artistsTemplate(this.artist));
        $('ul.artists-list').append('<li><a href="/artists/' + this.artist.id + '/tattoos">' + this.artist.name + '</a></li>');
      });
      $(document).trigger('draggableProfiles');
    });
    return false;
  });
 
  // refresh asset resources container
  $('a.refresh-assets').click(function(){
    $('ul.assets-wrapper').html(loading);
    $.getJSON(this.href + '.json', function(rsp){
      $('ul.assets-wrapper').empty();
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

   // refresh and load tattoo resources.  
    'a.refresh-tattoos, ul.artists-list li a' : function(e){
      $('ul.artists-list li a').removeClass('active');
      $(e.target).addClass('active');
      $('ul.tattoos-wrapper').html(loading);
      $.get(e.target.href + '.json',function(rsp){
        $('ul.tattoos-wrapper').empty();
        if(0 == rsp.length){
          $('ul.tattoos-wrapper').html('No tattoos found.');
          return false;
        }
        $.each(rsp, function(){
          this.tattoo.src = getFirstImage(this.tattoo.assets);
          $('ul.tattoos-wrapper').append(tattoosTemplate(this.tattoo));
        });
        $(document).trigger('draggableProfiles');
      });
      return false;
    },

    // edit profiles via facebox
    '.drag-profile img, .shop-each img' : function(e){
      var profile = $(e.target).attr('id');
	    if(undefined == profile){alert('profile id was not found'); return false};
	    profile = profile.split('_');
	    $hAssets.empty();
	    $hProfile.empty();
	    $(e.target).clone().appendTo($hProfile);
      $.facebox(function() { 
        $.getJSON('/' + profile[0] + '/' + profile[1] + '.json', function(rsp) {
          $.each(rsp[profile[0].slice(0, -1)].assets, function(){
            $hAssets.append(assetsWorkTemplate(this));
          });
          $.facebox({ div: '#the-workspace' }, 'workspace-wrapper');
        })       
      });
      return false;
    },
      
   // "save" working assets to working profile resource.
    'a.attach-assets' : function(e){
      var profile = getProfile(); if(!profile) return false;
      saveAssets(profile, true);
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
      var profile = getProfile(); if(!profile) return false;
      $('#facebox div.working-details').html(loading);
      $.get('/' + profile[0] + '/' + profile[1] + '/edit',
        function(view){
          $('#facebox div.working-details').html(view);
          $(document).trigger('ajaxify.form');
        });
      return false;
    },
  
    // hide the asset panel
    "div.asset-panel a.hide": function(e){
      $('div.dialog_wrapper').toggle();      
      if('hide'== $(e.target).html()){
        $(e.target).html('show images');
        $('div.asset-panel').css('top', $.getPageHeight()- 32);
      }else{
        $('div.asset-panel').css('top', $.getPageHeight()- 300);
        $(e.target).html('hide')
      }
      return false;
    },
    
   // disable clicking on tattoo profiles.
    'ul.tattoos-wrapper a' : function(e){
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
    })
  });

  // make working assets sortable.
  $(document).bind('wAssetsSortable', function(){
    $wAssets.sortable({
      items: 'img',
      forceHelperSize: true,
      forcePlaceholderSize: true,
      placeholder: 'sortable-placeholder'
    })
  });  

  // make super trashcan droppable
  $(document).bind('superTrash', function(){
    $('li.super-trash').droppable({
      accept: '.drag-profile', //.drag-asset cannot delete images yet 
      activeClass: 'ui-state-highlight',
      hoverClass: 'drophover',
      tolerance: 'touch',
      drop: function(e, ui){
        if($(ui.draggable).hasClass('drag-profile')){
          var profile = $('img:first',$(ui.draggable)).attr('id');
        }else if($(ui.draggable).hasClass('drag-asset')){
          var profile = $(ui.draggable).attr('id');
          $(ui.draggable).parent().remove();
        }
        profile = profile.split('_');
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
            $(ui.draggable).remove();
            $(ui.helper).remove();
          }
        })
      }
    })
  }); 
      
  // make working trashcan droppable
  $(document).bind('droppableTrash', function(){
    $('div.trashcan').droppable({
      accept: '#facebox .drag-asset',
      activeClass: 'ui-state-highlight',
      hoverClass: 'drophover',
      tolerance: 'touch',
      drop: function(e, ui) {
        if($(ui.draggable).hasClass('is-new')){
          $(ui.draggable).remove();
          return;
        }
        var profile = getProfile();
        var asset = $(ui.draggable).attr('id').split('_');
        $.getJSON('/' + profile[0] + '/' + profile[1] + '/detach',
          {asset: asset[1]},
          function(rsp){
            $(document).trigger('responding', rsp);
            $(ui.draggable).remove();
        })
      }
    })
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

  // make artist/tattoo resources draggable.  
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
      dataType : 'json',     
      beforeSubmit: function(fields, form){
        if(! $("input", form[0]).jade_validate() ) return false;
        $('button', form[0]).attr('disabled','disabled').removeClass('positive');
        $(document).trigger('submitting');
      },
      success: function(rsp) {
        if(undefined != rsp.created){      
          $hAssets.empty();
          $hProfile.html('<img src="/images/no-image.gif" id="'+ rsp.created.resource +'_'+ rsp.created.id +'"/>' + rsp.created.resource); 
          $.facebox({ div: '#the-workspace' }, 'workspace-wrapper');
          $('a.refresh-' + rsp.created.resource).click();
        }
        $(document).trigger('responding', rsp);
        $('#facebox form button').removeAttr('disabled').addClass('positive');
      }
    });
  });

  // facebox reveal callback  
  $(document).bind('reveal.facebox', function(){
    $wAssets  = $('#facebox div.working-assets');
    $wProfile = $('#facebox div.working-profile');
    $(document).trigger('wAssetsSortable');
    $(document).trigger('droppableTrash');
    $(document).trigger('ajaxify.form');
  });

  // facebox close callback
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
    $('div.responding').clone().addClass('active ' + status).html(msg).show().insertAfter('.responding');
    setTimeout('$(".responding.active").fadeOut(4000)', 1900);  
  });


/* helper functions 
------------------------------- */

  /* return the resource type and id or false
   * @return Array or false 
   */    
  function getProfile(){
    var profile = $('img', $wProfile).attr('id');
    if(undefined == profile){ alert('Add a profile to the workspace'); return false };
    return profile.split('_');
  };

  /* return the correct first image of a profile's album
   */ 
  function getFirstImage(assets){
    return (assets.length <= 0)
      ? '/images/no-image.gif'
      : '/system/datas/' + assets[0].id +'/thumb/'+ assets[0].data_file_name;    
  } 
    
  /* collect working assets
   * @param profile = Array
   * @param complain = bool
	 * Note: this only saves new assets.
	 * TODO: add positioning.
   */
  function saveAssets(profile, complain){
	  var ids = [];
	  $("img.is-new", $wAssets).each(function(){
	    ids.push(this.id.split('_')[1]);
    });
    if(ids.length <= 0){
      if(complain) alert('No New Images in the Workspace');
      return false;
    }    
    $(document).trigger('submitting');
    $.getJSON('/' + profile[0] + '/' + profile[1] + '/attach',
      $.param({asset: ids}),
      function(rsp){
        $(document).trigger('responding', rsp);
        if('good' == rsp.status)
          $("img.is-new", $wAssets).removeClass('is-new');
    })
  };
  
  
}); //end

// Adapted from getPageSize() by quirksmode.com
jQuery.getPageHeight = function() {
	var windowHeight;
	if (self.innerHeight) { windowHeight = self.innerHeight; }
	else if (document.documentElement && document.documentElement.clientHeight) {windowHeight = document.documentElement.clientHeight;}
	else if (document.body) { windowHeight = document.body.clientHeight;}	
	return windowHeight
};
