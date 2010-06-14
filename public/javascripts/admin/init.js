;$(document).ready(function(){
  $wProfile = $('div.working-profile');
  $wAssets  = $('div.working-assets');
 
  // activate tab navigation
  $('ul.main-tabs li a').click(function(){
    $('div.tab-content').hide();
    $('ul.main-tabs li a').removeClass('active');
    $(this).addClass('active');
    $('div#'+ $(this).attr('rel')).show();
    return false;
  });

  // working profile container is droppable
  $wProfile.droppable({
    accept: '.drag-profile',
    activeClass: 'ui-state-highlight',
    hoverClass: 'drophover',
    tolerance: 'touch',
    drop: function(e, ui) {
      $('span', this).html($(ui.draggable).html());
      $('ul.workspace-toolbar li.edit a').removeClass('disable');
	    if(undefined != $('img:first', $wAssets).attr('src'))
        $('ul.workspace-toolbar li.save a').removeClass('disable');
      
      var profile = $('img:first', $(ui.draggable)).attr('id');
	    if(undefined == profile){alert('profile id was not found'); return false};
	    profile = profile.split('_');
	    $("img:not(.is-new)", $wAssets).remove();
      $.getJSON('/' + profile[0] + '/' + profile[1] + '.json', function(rsp) {
        $.each(rsp[profile[0].slice(0, -1)].assets, function(){
          $wAssets.append(assetsWorkTemplate(this));
        });
        $(document).trigger('workingAssetsSortable');
      });
    }
  }); 

  // working assets container is droppable
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

  // trashcan is droppable
  $('div.trashcan').droppable({
    accept: '.drag-asset, .drag-profile',
    activeClass: 'ui-state-highlight',
    hoverClass: 'drophover',
    tolerance: 'touch',
    drop: function(e, ui) {
      if($(ui.draggable).hasClass('drag-profile')){
        console.log('ruhoh remove profile!');
        $(ui.draggable).remove();
        return;
      }
      
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
  
/* workspace interactions (click)
----------------------------------- */ 
// collect working assets
  // @resource = Array, @complain = bool 
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
   
  // "save" working assets to working profile resource.
  $('a.attach-assets').click(function(){
	  var resource = $('img', $wProfile).attr('id');
	  if(undefined == resource){ alert('Add a profile to the workspace'); return false };
    resource = resource.split('_');
    if('new' == resource[1]){
      $.facebox(function(){
        $.get('/' + resource[0] + '/new',
          function(view) { $.facebox(view) });
      });
      return;   
    }
    saveAssets(resource, true);
    return false;
  });
  
  // "edit" the working profile resource.
  $('a.edit-profile').click(function(){
	  var resource = $('img', $wProfile).attr('id');
	  if(undefined == resource){
	    alert('Add a profile to the workspace'); return false
	  };
	  resource = resource.split('_');
    $.facebox(function() {
      $.get('/' + resource[0] + '/' + resource[1] + '/edit',
        function(data) { $.facebox(data) });
    });
    return false;
  });
  
  // clear the unsaved working assets
  $('a.clear-assets').click(function(){
    $('img.is-new', $wAssets).remove();
    $('li.save a, li.clear a', 'ul.workspace-toolbar').addClass('disable');
    return false;
  });

  // load new artist or tattoo profile
  $('a.tattoos_new, a.artists_new').click(function(){
    var data = '<img src="/images/no-image.gif" id="'+ $(this).attr('class') +'"/>' + $(this).attr('class');
    $('span', $wProfile).html(data);
    $('img:not(.is-new)', $wAssets).remove();
    return false;
  });
    
    
/* resource interactions (click)
----------------------------------- */
  // tattoo resources are loadable.  
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

  // refresh asset resources container
  $('a.refresh-assets').click(function(){
    $('ul#assets-wrapper').empty();
    $.getJSON(this.href + '.json', function(rsp){
      $.each(rsp, function(){
        $('ul#assets-wrapper').append(assetsReTemplate(this.asset));
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

  $('body').dblclick($.delegate({ 
    // open edit panel via facebox
    '.drag-profile img' : function(e){
	    var profile = $(e.target).attr('id').split('_');
      $.facebox(function() {
        $.get('/' + profile[0] + '/' + profile[1] + '/edit',
          function(data) { $.facebox(data) });
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
  // make asset resources draggable
  $(document).bind('draggableAssets', function(){
    $("ul#assets-wrapper li img").draggable({
      appendTo: 'body',
      stack: "ul.assets-wrapper li img",
      zIndex: 2700,
      revert: true,
      helper: 'clone',
      connectToSortable: 'div.working-assets'
    });
  });

// make working assets sortable.
  $(document).bind('workingAssetsSortable', function(){
    $wAssets.sortable({
      items: 'img',
      forceHelperSize: true,
      forcePlaceholderSize: true,
      placeholder: 'sortable-placeholder'
    });
  });  

// make shop/artist resources draggable.  
  $(document).bind('draggableProfiles', function(){
    $(".drag-profile").draggable({
      appendTo: 'body',
      handle: 'img',
      stack: ".drag-profile",
      zIndex: 2700,
      revert: true
    });  
  }); 
      
  // make tattoo resources draggable.
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
          $('button', form[0]).attr('disabled','disabled').removeClass('jade_positive');
        $(document).trigger('submitting');
      },
      success: function(rsp) {
        console.log(rsp);
        $(document).trigger('responding', rsp);
        $('.facebox form button').removeAttr('disabled').addClass('jade_positive');
        if(undefined != rsp.created)
          saveAssets([rsp.created.resource, rsp.created.id]);
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
