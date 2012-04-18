////////////////////////////////////////////////////////////////////////////////////
/*
 * jQuery ddGallery v3.1.1 :: 2012-04-18
 * http://inventurous.net/ddgallery
 *
 * Copyright (c) 2012, Darren Doyle
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
////////////////////////////////////////////////////////////////////////////////////


// YouTube API LOAD CHECK 
window.ddGalleryWaitForYoutube=true;
// Collision detection
if (typeof(onYouTubePlayerAPIReady) != 'function') {
	function onYouTubePlayerAPIReady() {
		window.ddGalleryWaitForYoutube=false;
	};
};

// ----------------------
	
(function( $ ) {
	

	/////////////////////////////////////////
	// INITIALIZE ddGALLERY MEGA-VARIABLES //
	/////////////////////////////////////////
	var galleryTpl, arrowTpl, youtubeLoaded=false,
	
		loadYoutubeAPI = function(){
			var newTag, firstScript;
			newTag = document.createElement('script');
			newTag.src = "http://www.youtube.com/player_api";
			newTag.type = "text/javascript";
			firstScript = document.getElementsByTagName('script')[0];
			firstScript.parentNode.insertBefore(newTag, firstScript);
		};

	///////////////////////////
	// MAIN GALLERY TEMPLATE //
	///////////////////////////
	// stage
	galleryTpl = '<div class="ddGallery-stage-wrapper" style="width:100%; height:100%; position:relative; overflow:hidden;">';
	galleryTpl+= 	'<div class="ddGallery-stage loading" style="width:100%; height:100%;"></div>';
	galleryTpl+= '</div>';
	
	// count
	galleryTpl+= '<div class="ddGallery-count"></div>';
	
	// zoom and fullscreen
	galleryTpl+= '<div class="ddGallery-toggles">';
	galleryTpl+= 	'<a href="javascript:;" class="ddGallery-fullScreen"><div><div></div></div></a>';
	galleryTpl+= 	'<a href="javascript:;" class="ddGallery-zoom"></a>';
	galleryTpl+= '</div>';
	
	// thumb controller
	galleryTpl+= '<div class="ddGallery-controls" style="position:absolute; top:auto; bottom:0; overflow:hidden;">';
	galleryTpl+= 	'<div class="ddGallery-thumbs-wrapper" style="position:relative; width:auto; height:100%; overflow:hidden">';
	galleryTpl+= 		'<div class="ddGallery-thumbs" style="position:absolute; top:0; left:0; height:100%;"></div>';
	galleryTpl+= 	'</div>';
	galleryTpl+= '</div>';
	
	// dot navigation
	galleryTpl+= '<div class="ddGallery-dotNav"></div>';

	// captions
	galleryTpl+= '<div class="ddGallery-caption-wrapper" style="position:absolute; top:auto; bottom:0; overflow:hidden; width:100%; opacity:0">';
	galleryTpl+= 	'<div class="ddGallery-caption"></div>';
	galleryTpl+= '</div>';

	// pin tab
	galleryTpl+= '<div class="ddGallery-control-tab" style="position:absolute; top:auto; bottom:0; overflow:hidden;"></div>';

	// arrows
	galleryTpl+= '<a class="ddGallery-arrows ddGallery-arrow-left" style="position:absolute; display:block; opacity:0; overflow:hidden;" href="javascript:;">';
	galleryTpl+= 		'<span class="arrow" style="position:absolute; width:0; height:0;"></span>';
	galleryTpl+= '</a>';
	galleryTpl+= '<a class="ddGallery-arrows ddGallery-arrow-right" style="position:absolute; display:block; opacity:0; overflow:hidden;" href="javascript:;">';
	galleryTpl+= 		'<span class="arrow" style="position:absolute; width:0; height:0;"></span>';
	galleryTpl+= '</a>';

	
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

	///////////////////////////
	// INITIALIZATION OBJECT //
	///////////////////////////
	$.ddGallery = function(element, options){
		var dd = this;
		
		// initialize
		dd.gal = $(element);
		dd.settings = $.extend({}, $.ddGallery.defaultOptions, options);
		dd.id = 'ddGallery-gallery-' + (Math.floor(Math.random()*10000));
		dd.itemCount = dd.gal.children('a,img,div,iframe').length;
		dd.hover = false;
		dd.animating = false;
		dd.initial = true;
		dd.initialSpeed = 250;
		dd.curItem = 0; 
		dd.youtubePlayers=[];
		dd.imageDimensions=[];
		dd.videoPlaying=false;
		dd.pinned=false;
		dd.autopinned=false;
		dd.userPlay=false;
		dd.paused=false;
		dd.touched=false;
		dd.fullScreen=false;
		dd.navSource = '';
		dd.capSizes = {heights:{},borders:{'t':0,'b':0},margins:{'t':0,'b':0},padding:{'t':0,'b':0}};
		
		dd.debug = $('#ddGallery-debug');
		
		// draw gallery
		dd.draw(dd);
    };

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
	
	/////////////////////
	// DEFAULT OPTIONS //
	/////////////////////
	$.ddGallery.defaultOptions = {
		
		captions : true,
		externalCaptions : false,
		captionHideSpeed : 250,
		captionPause : 2000,
		hideCaptions : true,
		
		count : false,
		countType : 'total',
		hideCount : true,
		
		pinTab : true,
		pinned : false,
		
		autoPlay : false,
		
		arrows : true,
		hideArrows : true,
		arrowsHideSpeed : 250,
		
		startItem : 1,
		
		keyboard : true,
		
		thumbs : true,
		hideThumbs : true,
		
		dotNav : false,
		dotNavNumbers : false,
		
		thumbsHideSpeed : 150,
		thumbsScrollSpeed : 350,
		thumbsNumbers : false,
		thumbsPush : false,
		
		stageRotateType : 'fade',
		stageRotateSpeed : 500,
		stagePause : 4000,
		
		rotate : true,
		playlist : false,
		hoverPause : true,
		enlarge : true,
		stretch : false,
		
		fullScreen : true,
		thumbsPushOnFull : true,
		hideThumbsOnFull : false,
		hideCaptionsOnFull : false,
		hideCountOnFull : true,
		hoverPauseOnFull : true,
		
		zoom : false,
		hideZoom : true
	};
	
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
	
	///////////////////////////
	// MAIN PROTOTYPE OBJECT //
	///////////////////////////
	$.ddGallery.prototype = {
		
		////////////////////////
		// INITIALIZE GALLERY //
		////////////////////////
		draw : function(dd) {
			
			// ONE ITEM HANDLING //
			if (dd.itemCount<=1) {
				dd.settings.thumbs = false;
				dd.settings.arrows = false;
				dd.settings.count = false;
			};
			
			// animation sanity check
			switch (dd.settings.stageRotateType) {
				case 'fade':
				case 'pushH':
				case 'pushV':
				case 'slideH':
				case 'slideV':
				case 'drop':
				case 'lift':
					break;
				default:
					dd.settings.stageRotateType = 'fade';			
			};
			
			// start item sanity check
			dd.settings.startItem = parseInt(dd.settings.startItem);
			dd.settings.startItem = (dd.settings.startItem>dd.itemCount) ? dd.itemCount : (dd.settings.startItem<1) ? 1 : dd.settings.startItem;
			
			// playlist mode?
			if (dd.settings.playlist) {
				dd.userPaused = !dd.settings.autoPlay;
				dd.settings.autoPlay = false;
			};
			
			// set css value(s) on main container
			dd.gal.css({
				'position' : (dd.gal.css('position')=='static') ? 'relative' : dd.gal.css('position')
			}).addClass('ddGallery-main');
			
			// store original content
			dd.origBody = $('body').css('overflow');
			dd.origData = dd.gal.html();
			dd.origCSS = {
				'z-index':dd.gal.css('z-index'),
				'position':dd.gal.css('position'),
				'top':dd.gal.css('top'),
				'left':dd.gal.css('left'),
				'width':dd.gal.css('width'),
				'height':dd.gal.css('height'),
				'margin':dd.gal.css('margin')				
			};
			dd.orig = $('<div />').html(dd.gal.html());
			
			// populate current gallery with requisite html structure
			dd.gal.html(galleryTpl).ready(function(){
				var thumbContent='', dotContent='',
					itemCounter=1;
				
				// get objects
				dd.caption = dd.gal.find('.ddGallery-caption-wrapper');
				dd.controls = dd.gal.find('.ddGallery-controls');
				dd.tab = dd.gal.find('.ddGallery-control-tab');
				dd.tabB = parseInt(dd.tab.css('bottom'));
				dd.count = dd.gal.find('.ddGallery-count');
				dd.stageWrap = dd.gal.find('.ddGallery-stage-wrapper');
				dd.stage = dd.stageWrap.children('.ddGallery-stage');
				dd.thumbWrap = dd.gal.find('.ddGallery-thumbs-wrapper');
				dd.thumbs = dd.thumbWrap.children('.ddGallery-thumbs');
				dd.zoom = dd.gal.find('.ddGallery-zoom');
				dd.full = dd.gal.find('.ddGallery-fullScreen');
				dd.dot = dd.gal.find('.ddGallery-dotNav');
				
				// set layer order
				dd.mainZ = (dd.gal.css('z-index') == 'auto') ? 0 : parseInt(dd.gal.css('z-index'));
				dd.gal.find('.ddGallery-stage-wrapper').css({'z-index':dd.mainZ});
				dd.gal.find('.ddGallery-arrows').css({'z-index':dd.mainZ+5});
				dd.controls.css({'z-index':dd.mainZ+5});
				dd.tab.css({'z-index':dd.mainZ+5});
				dd.zoom.parent('.ddGallery-toggles').css({'z-index':dd.mainZ+5});
				dd.caption.css({'z-index':dd.mainZ+5});
				
				///////////////////////////
				// BUTTON INITIALIZATION //
				///////////////////////////
				
				// SET UP DOT NAV
				if (dd.settings.dotNav) {
					dd.dot.css({'display':'block','z-index':dd.mainZ+7});
				} else {
					dd.dot.css({'display':'none'});
				};
				
				// SET UP COUNT
				if (dd.settings.count) {
					dd.count.css({'display':'block','z-index':dd.mainZ+3});
				} else {
					dd.count.css({'display':'none'});
				};
				
				// SET UP ZOOM TOGGLE
				if (dd.settings.zoom) {
					dd.zoom.css({'display':'none','opacity':0});
				} else {
					dd.zoom.css({'display':'none'});
				};
				
				// SET UP FULL SCREEN TOGGLE
				if (dd.settings.fullScreen) {
					dd.full.css({'display':'block','opacity':1});
				} else {
					dd.full.css({'display':'none'});
				};
				
				// SET UP PIN TAB
				if (!dd.settings.pinTab	|| (!dd.settings.captions && !dd.settings.thumbs) || ((dd.settings.thumbsPush && !dd.settings.hideThumbs) && !dd.settings.captions)) {
					dd.tab.css({'display':'none'});
					dd.settings.pinTab = false;
				} else {
					// position tab
					dd.tab.css({
						'left' : Math.floor(dd.stage.width()/2) - Math.floor(dd.tab.outerWidth()/2),
						'top' : 'auto'
					});
				};
				
				
				//////////////////
				// BUILD THUMBS //
				//////////////////
				
				// loop through every item in this gallery and build item list
				dd.orig.children('a, img, div, iframe').each(function(){
					var me = $(this),
						url='', thumb, cap,
						numberTag='',
						linkOut='', linkTarget='',
						type='img', thumbResize='',
						sourceId='', sourceClass='', 
						itemId='ddGallery'+(Math.floor(Math.random()*1000000)),
						kid = me.children('img');
						href = me.attr('href'),
						forced = (me.attr('type')==undefined) ? '' : me.attr('type'),
					
						linkType = (href=='' || href==undefined)
							? [,false] : (
								href.match(/http:\/\/(?:www\.|)(vimeo|youtube)\.com(?:.*)((?:\/)([a-zA-Z0-9-_]+)(?:$|&|\?)|((?:[0-9]\/)|(?:embed\/)|(?:v\/)|(?:v=))([a-zA-Z0-9-_]+)(?:$|&|\?))/i)
								|| href.match(/.*(?=\.(jpg|jpeg|gif|png)(?:$|\?))/i)
								|| [,false]
							);
							
					// links and images
					if (me.is('a') || me.is('img')) {
						
						// direct image or clickable image
						if ( me.is('img') || ((!linkType[1] || forced=='link') && forced!='image') ) {
							if (me.is('a')) {
								type = 'clickable';
								linkOut = me.attr('href');
								linkTarget = (me.attr('target')==undefined)?'':me.attr('target');
								me = kid;
							};
							url = me.attr('src'), // url to full-size image
							thumb = me.attr('src'), // url to thumbnail
							cap = me.attr('alt'); // caption
							
							// resize for thumbnail (doesn't work in IE 8 or lower)
							thumbResize = ';background-repeat:no-repeat round;background-size:auto 100%;';
						
						// linked image
						} else if ( (linkType[1]=='jpg' || linkType[1]=='jpeg' || linkType[1]=='gif'|| linkType[1]=='png') || forced=='image' ) {
							url = me.attr('href'), // url to full-size image
							thumb = kid.attr('src'), // url to thumbnail
							cap = me.children('img').attr('alt'); // caption
							
						
						// youtube video
						} else if (linkType[1]=='youtube') {
							url = linkType[5];
							me.addClass(url); // add this id as class to pull content later
							cap = me.attr('title'); // caption
							type = 'youtube';
							thumb = 'http://img.youtube.com/vi/'+linkType[5]+'/2.jpg';
							
							// load YouTube API 
							if (!youtubeLoaded) {
								loadYoutubeAPI();
								youtubeLoaded = true;
							};
							window.ddGalleryWaitForYoutube = (window.ddGalleryWaitForYoutube===undefined || window.ddGalleryWaitForYoutube===true)?true:false;
							
						// vimeo video
						} else if (linkType[1]=='vimeo') {
							url = 'http://player.vimeo.com/video/' + linkType[3] + '?api=1&player_id='+itemId;
							me.addClass(url); // add this id as class to pull content later
							cap = me.attr('title'); // caption
							type = 'vimeo';
							$.ajax({
								type:'GET',
								url: 'http://vimeo.com/api/v2/video/' + linkType[3] + '.json',
								jsonp: 'callback',
								dataType: 'jsonp',
								success: function(data){
									dd.thumbs.find('a[itemId="'+itemId+'"]').css('background-image', 'url('+data[0]['thumbnail_small']+')');
								}
							});
						};
						
					// div
					} else if (me.is('div')) {
						sourceClass = me.attr('class'); // migrate existing classes
						sourceId = me.attr('id'); // migrate existing id
						me.addClass(itemId); // add this id as class to pull content later
						thumb = me.attr('thumb'); // url to thumbnail
						cap = me.attr('title'); // caption
						type = 'div';
					
					// iframe
					} else if (me.is('iframe')) {
						sourceClass = me.attr('class'); // migrate existing classes
						sourceId = me.attr('id'); // migrate existing id
						url = me.attr('src'); // iframe url
						me.addClass(url); // add this id as class to pull content later
						thumb = me.attr('thumb'); // url to thumbnail
						cap = me.attr('title'); // caption
						type = 'iframe';
					};
					
					// clean content
					sourceClass = (sourceClass==undefined) ? '' : sourceClass;
					sourceId = (sourceId==undefined) ? '' : sourceId;
					cap = (cap==undefined || cap==null || cap=='' || cap==' ') ? '&nbsp;' : cap;				
					thumb = (thumb==undefined) ? '' : ';background-image:url('+thumb+')';
					
					// add numbers?
					numberTag = (dd.settings.thumbsNumbers) ? '<span class="ddGallery-number">'+itemCounter+'</span>' : '';
					
					// append item to html
					thumbContent += '<a href="'+url+'" itemId="'+itemId+'" sourceId="'+sourceId+'" sourceClass="'+sourceClass+'" class="'+type+'" style="position:relative;display:block;float:left'+thumb+thumbResize+'" title="'+cap+'" linkOut="'+linkOut+'" linkTarget="'+linkTarget+'">'+numberTag+'<span class="ddGallery-watermark"></span></a>';
					
					// create dot nav?
					if (dd.settings.dotNav) {
						dotContent += '<a href="javascript:;" class="'+((dd.settings.dotNavNumbers) ? 'number' : 'dot')+'">'+((dd.settings.dotNavNumbers) ? itemCounter : '')+'</a>';
					};
					
					// get caption size array for animation
					if (dd.settings.captions){
						
						if (cap=='&nbsp;') {
							dd.capSizes.heights[itemId] = {'h':0,'o':0};
						} else {
							dd.caption.children('.ddGallery-caption').html(cap);
							dd.capSizes.heights[itemId] = {
								'h':dd.caption.height(),
								'o':dd.caption.outerHeight()
							};
						};
												
					};
					
					itemCounter++;
					
				});
				
				// get universal caption sizes
				dd.capSizes.borders['t'] = dd.caption.css('border-top-width');
				dd.capSizes.borders['b'] = dd.caption.css('border-bottom-width');
				dd.capSizes.margins['t'] = dd.caption.css('margin-top');
				dd.capSizes.margins['b'] = dd.caption.css('margin-bottom');
				dd.capSizes.padding['t'] = dd.caption.css('padding-top');
				dd.capSizes.padding['b'] = dd.caption.css('padding-bottom');
				
				
				////////////////
				// ADD THUMBS //
				////////////////
				
				// add thumbs (thumbs required for function, even if not shown)
				dd.dot.html(dotContent);
				dd.thumbs.append(thumbContent).ready(function(){

					// show thumbs?
					if (dd.settings.thumbs) {
						// set up thumbs
						dd.thumbW = dd.thumbs.children('a:first-child').outerWidth(true);
						dd.thumbH = dd.thumbs.children('a:first-child').outerHeight(true);
						
						// controller height
						dd.controlH = dd.thumbH;
						
						// caption position
						dd.caption.css({'bottom':dd.controlH});
					
					// hide thumbs?
					} else {	
						// hide thumbs
						dd.thumbWrap.css({'display':'none'});
						
						// controller height
						dd.controlH = 0;
						
						// caption position
						dd.caption.css({'bottom':0});
						
					};
						
					
					//////////////////
					// BUILD ARROWS //
					//////////////////
					dd.positionArrows();
					
					//////////////////////
					// BUILD CONTROLLER //
					//////////////////////
					if (dd.settings.thumbs) {

						// set controller dimensions
						dd.controlH = dd.controls.css({
							'width' : '100%',
							'height' : dd.controlH
						}).outerHeight();
						
						// set thumb container width
						dd.thumbs.css({'width' : (dd.thumbW * dd.itemCount)});
						
						// set thumbs max scroll
						dd.maxScroll = dd.thumbWrap.outerWidth() - dd.thumbs.outerWidth();
						
					};
						
					// set stage height
					dd.stageWrap.height( (dd.settings.thumbsPush || (dd.settings.thumbsPushOnFull && dd.fullScreen)) ? dd.gal.height()-dd.controlH : dd.gal.height() );
					
					
					///////////////////////
					// LOAD INITIAL ITEM //
					///////////////////////
					dd.gal.ready(function(){
						dd.gal.find('.ddGallery-thumbs a:nth-child('+dd.settings.startItem+')').click();
											
						// hide/show arrows?
						if (!dd.settings.hideArrows) {
							dd.gal.find('.ddGallery-arrows').css({'opacity':1});
						};
						
						// hide the thumbs?
						if (dd.settings.hideThumbs) {
							dd.thumbWrap.css({'bottom':(-1 * dd.controlH)});
						};
						
						// set initial caption position
						if (dd.settings.captions) {
							dd.caption.css({'height':0,'bottom': ((dd.settings.hideThumbs || !dd.settings.thumbs) ? 0 : dd.controlH) }).addClass('collapsed');
						};
						
						// set initial tab position
						if (dd.settings.pinTab) {
							dd.tab.css({'bottom': dd.tabB + ((!dd.settings.thumbs || dd.settings.hideThumbs) ? 0 : dd.controlH)});
						};
						
						// start pinned?
						if (dd.settings.pinned && dd.settings.pinTab) {
							dd.tab.mouseup();
						};
						
						// LISTEN FOR MOUSE MOVE
						// trigger mouseenter if mouse already inside element on load
						dd.gal.on('mousemove', function(){
							dd.gal.mouseenter();
							dd.gal.off('mousemove');
						});
						
					});
				});
				
				
				
				/////////////////////////////////
				// THUMBNAIL CLICK (LOAD ITEM) //
				/////////////////////////////////
				dd.gal.find('.ddGallery-thumbs a').on('click', function(e){
					e.preventDefault();
					
					// initialize
					var thisThumb = $(this), // this thumbnail
						type = thisThumb.attr('class'), // type of content animating to
						typeFrom = dd.thumbs.children('a:nth-child('+dd.curItem+')').attr('class'), // type of content animating from
						url = thisThumb.attr('href'), // the content
						itemId = thisThumb.attr('itemId'), // the unique ID for this item
						cap = thisThumb.attr('title'), // image description
						sourceId = thisThumb.attr('sourceId'), // id of original item
						sourceClass = thisThumb.attr('sourceClass'), // classes of original item
						linkOut = thisThumb.attr('linkOut'), // clickable image link
						linkTarget = thisThumb.attr('linkTarget'), // target for the clickable image link
						tL = parseInt(dd.thumbs.css('left')),
						thumbL = parseInt(thisThumb.position().left) - (parseInt(thisThumb.css('border-left-width'))) - (parseInt(thisThumb.css('margin-left'))),
						newLeft,
						wW,
						isLast = false,
						dir = (dd.curItem==1
							&& ($(this).index()+1)==dd.itemCount
							&& dd.itemCount>2
							&& dd.navSource!='')
								? false
								: (dd.curItem==dd.itemCount && ($(this).index()+1)==1 && dd.navSource!='')
									? true
									: (dd.curItem < ($(this).index()+1));
					
					// set stage height
					dd.stageWrap.height( (dd.settings.thumbsPush || (dd.settings.thumbsPushOnFull && dd.fullScreen)) ? dd.gal.height()-dd.controlH : dd.gal.height() );
					
					// update curItem marker
					dd.curItem = $(this).index()+1;
					isLast = dd.curItem == dd.itemCount;
					
					// invert direction?
					if (dd.navSource == 'left' && dd.itemCount < 3) { dir = !dir; }
					dd.navSource = '';
					
					// waiting for YouTube API to load?
					if (type=='youtube' && window.ddGalleryWaitForYoutube) {
						setTimeout(function(){
							thisThumb.click();
						}, 0);
						return;
					};					
					
					// item is not already selected or animating
					if ( !($(this).is('.selected') || dd.animating) ) {
					
						// clean up caption
						cap = (cap == 'undefined') ? '' : cap;			
						
						// throw up flag!
						dd.animating = true;
						
						// stop any current animation
						dd.stage.stop(1,0);
						dd.caption.stop(1,0);
						
						// stop any youtube videos from playing
						dd.stage.find('.ddGallery-youtube-wrapper').each(function(){
							dd.autoPause = true;
							dd.youtubePlayers[$(this).attr('id')].pauseVideo();
						});
						
						// if still autopinned on next, unpin
						if (dd.autopinned) {
							dd.tab.mouseup();
						};
						
						// clear timers
						clearTimeout(dd.rotator);
						clearTimeout(dd.captionDelay);
						
						// highlight and tag the current selection
						thisThumb.siblings('a').removeClass('selected');
						thisThumb.addClass('selected');
						dd.dot.children('a').removeClass('selected');
						dd.dot.children('a:nth-child('+dd.curItem+')').addClass('selected');
						
						// add loading class to stage
						dd.stage.addClass('loading');
						
						// animate out previous item
						if (dd.stage.find(".selected").length > 0) {
							eval('dd.animOut_'+dd.settings.stageRotateType+'(dd.stage.find(".selected"),type,typeFrom,dir);');
						};
						
						
						///////////////////////////
						// CONTENT TYPE HANDLING //
						///////////////////////////
						if (dd.stage.find('#'+itemId).length === 0) {
						
							switch (type) {
							
								////////////
								// IMAGES //
								////////////
								case 'img' :
									dd.stage.append('<img src="'+url+'" class="ddGallery-item" id="'+itemId+'" alt="'+cap+'" style="opacity:0;position:absolute;" />');
									dd.stage.children('#'+itemId).load(function(){
										dd.stage.removeClass('loading');
										dd.stage.find('#'+itemId).addClass('selected');
										dd.setImageDimensions(dd.stage.children('#'+itemId), typeFrom, dir, 'in');
									});
									break;
								
								
								//////////////////////
								// CLICKABLE IMAGES //
								//////////////////////
								case 'clickable' :
									dd.stage.append('<a href="'+linkOut+'" target="'+linkTarget+'"><img id="'+itemId+'" src="'+url+'" class="ddGallery-item" alt="'+cap+'" style="opacity:0;position:absolute;" /></a>');
									dd.stage.find('#'+itemId).load(function(){
										dd.stage.removeClass('loading');
										dd.stage.find('#'+itemId).addClass('selected');
										dd.setImageDimensions(dd.stage.find('#'+itemId), typeFrom, dir, 'in');
									});
									break;
									
								
								//////////
								// DIVS //
								//////////
								case 'div' :
									dd.showZoom(false, dd.settings.stageRotateSpeed);
									dd.stage.append('<div class="ddGallery-div-wrapper ddGallery-item" id="'+itemId+'" style="opacity:0;position:absolute;width:100%;height:100%;overflow:auto"><div class="'+sourceClass+'" id="'+sourceId+'">'+dd.orig.find('.'+itemId).html()+'</div></div>').ready(function(){
										dd.stage.removeClass('loading');
										dd.stage.find('#'+itemId).addClass('selected');
										eval('dd.animIn_'+dd.settings.stageRotateType+'(dd.gal.find("#"+itemId),type,typeFrom,dir);');
									});
									break;
									
								/////////////
								// IFRAMES //
								/////////////
								case 'iframe' :
									dd.showZoom(false, dd.settings.stageRotateSpeed);
									dd.stage.append('<div class="ddGallery-iframe-wrapper ddGallery-item" style="opacity:0;position:absolute;width:100%;height:100%;overflow:auto" id="'+itemId+'"><iframe allowfullscreen scrolling="auto" style="border:none;width:100%;height:100%;margin-bottom:-5px;" class="'+sourceClass+'" id="'+sourceId+'" src="'+url+'"></iframe></div>').ready(function(){
										dd.stage.removeClass('loading');
										dd.stage.find('#'+itemId).addClass('selected');
										eval('dd.animIn_'+dd.settings.stageRotateType+'(dd.gal.find("#"+itemId),type,typeFrom,dir);');
									});
									break;
									
								
								/////////////
								// YOUTUBE //
								/////////////
								case 'youtube' :
									dd.showZoom(false, dd.settings.stageRotateSpeed);
									dd.stage.append('<div class="ddGallery-youtube-wrapper ddGallery-item" style="opacity:0;position:absolute;width:100%;height:100%;overflow:hidden" id="'+itemId+'"><div id="'+itemId+'-video"></div></div>').ready(function(){
										dd.stage.removeClass('loading');
										dd.stage.find('#'+itemId).addClass('selected');
										eval('dd.animIn_'+dd.settings.stageRotateType+'(dd.gal.find("#"+itemId),type,typeFrom,dir);');
													
										dd.youtubePlayers[itemId] = new window['YT'].Player(itemId+'-video', {
											height: "100%",
											width: "100%",
											videoId: url,
											playerVars: {
												wmode: "opaque"
											},
											events: {
												
												// ON LOADED
												'onReady' : function(event){
													dd.animating = false;
													if (dd.settings.autoPlay || (dd.settings.playlist && !dd.userPaused)) {
														event.target.playVideo();
													};
												},
													
												'onStateChange' : function(event) {
													
													switch (event.data) {
														
														// ON PLAY/BUFFER
														case window['YT'].PlayerState.BUFFERING :
														case window['YT'].PlayerState.PLAYING :
															clearTimeout(dd.rotator);
															clearTimeout(dd.youtubeDelay);
															dd.youtubeDelay = false;
															dd.videoPlaying = true;
															dd.userPaused = false;
															
															if (!dd.pinned) {
																dd.tab.mouseup();
																dd.autopinned = true;
															};
															break;
														
														// ON PAUSE
														case window['YT'].PlayerState.PAUSED :
															if (!dd.autoPause) { dd.userPaused = true; };
															dd.autoPause = false;
															
															if (!dd.youtubeDelay) {
																dd.youtubeDelay = setTimeout(function(){
																	dd.videoPlaying = false;
																	if (dd.pinned && dd.autopinned) {
																		dd.tab.mouseup();
																	};
																	if ((dd.settings.rotate || dd.userPlay) && (!dd.hover || (!dd.fullScreen && !dd.settings.hoverPause) || (dd.fullScreen && !dd.settings.hoverPauseOnFull)) && !dd.settings.playlist && !dd.paused) {
																		clearTimeout(dd.rotator);
																		dd.rotator = setTimeout(function(){
																			dd.navSource='auto';
																			dd.rotateItems(true);
																		}, dd.settings.stagePause);
																	};
																}, 300);
															};
															break;
														
														// ON ENDED
														case window['YT'].PlayerState.ENDED :
															if (dd.settings.playlist && !isLast && !dd.paused) {
																dd.userPaused = false;
																event.target.seekTo(0,true);
																dd.navSource='auto';
																dd.rotateItems(true);
															
															} else if (!dd.youtubeDelay) {
																dd.youtubeDelay = setTimeout(function(){
																	dd.videoPlaying = false;
																	if (dd.pinned && dd.autopinned) {
																		dd.tab.mouseup();
																	};
																	if ((dd.settings.rotate || dd.userPlay) && (!dd.hover || (!dd.fullScreen && !dd.settings.hoverPause) || (dd.fullScreen && !dd.settings.hoverPauseOnFull)) && !dd.paused) {
																		clearTimeout(dd.rotator);
																		dd.rotator = setTimeout(function(){
																			dd.navSource='auto';
																			dd.rotateItems(true);
																		}, dd.settings.stagePause);
																	};
																}, 300);
															};
															break;
															
													};
												}												
											}
										});
										
											
									});
									break;
									
								///////////
								// VIMEO //
								///////////
								case 'vimeo' :
									dd.stage.append('<div class="ddGallery-vimeo-wrapper" style="opacity:0;position:absolute;width:100%;height:100%;overflow:hidden" id="'+itemId+'"><iframe allowfullscreen scrolling="auto" style="border:none;width:100%;height:100%;margin-bottom:-5px;" class="'+sourceClass+'" id="'+sourceId+'" src="'+url+'"></div></div>').ready(function(){
										dd.stage.removeClass('loading');
										dd.stage.find('#'+itemId).addClass('selected');
										eval('dd.animIn_'+dd.settings.stageRotateType+'(dd.gal.find("#"+itemId),type,typeFrom,dir);');
									});
									break;
							};
													
						// ITEM IS ALREADY LOADED: JUST SHOW IT
						} else {
							
							dd.stage.find('#'+itemId).addClass('selected');
						
							// resize items anyway (in case stage dimensions changed)
							if (type=='img') {
								dd.stage.removeClass('loading');
								dd.setImageDimensions(dd.stage.children('#'+itemId), typeFrom, dir, 'in');
							
							} else if (type=='clickable') {
								dd.stage.removeClass('loading');
								dd.setImageDimensions(dd.stage.find('#'+itemId), typeFrom, dir, 'in');
							
							} else {
								dd.showZoom(false, dd.settings.stageRotateSpeed);
								dd.stage.removeClass('loading');
								eval('dd.animIn_'+dd.settings.stageRotateType+'(dd.gal.find("#"+itemId),type,typeFrom,dir);');
								
								// YouTube playlist keep playing
								if (dd.settings.playlist && !dd.userPaused) {
									dd.youtubePlayers[itemId].seekTo(0, true);
									dd.youtubePlayers[itemId].playVideo();
								};								
							};
						};
							
							
						///////////////
						// SET COUNT //
						///////////////
						if (dd.settings.count) {
							switch (dd.settings.countType) {
								case 'total' :
									dd.count.html(dd.itemCount);
									break;
								
								case 'paged' :
									dd.count.html(dd.curItem+' of '+dd.itemCount);
									break;
							};
						};
						
						
						///////////////////
						// LOAD CAPTIONS //
						///////////////////
						
						// external captions?
						if (dd.settings.externalCaptions) {
							$(dd.settings.externalCaptions).html('<span class="ddGallery-externalCaptions">'+cap+'</span>');
						};
							
						// add caption
						dd.caption.attr('itemId',itemId).children('.ddGallery-caption').html(cap).ready(function(){
							var showCon=false;
								showCap=false;
								
							// show controller?
							if (!dd.pinned) {
								if ( dd.settings.thumbs && ((!dd.settings.hideThumbs || dd.hover) || (!dd.settings.hideThumbsOnFull && dd.fullScreen)) ) { showCon = true; };
								
								if (dd.settings.captions && cap) { showCap = true; }
									
								// move controls
								dd.moveControls(showCon, showCap, dd.settings.stageRotateSpeed);
								
								
							};
						
							// ---CAPTION HIDE TIMER---
							if (showCap) { dd.captionTimer(showCon); };
						});
						
					};
					
					////////////////////////////
					// THUMBNAILS AUTO-SCROLL //
					////////////////////////////
					if (dd.settings.thumbs){
						
						// initialize width
						wW = dd.thumbWrap.width();
						
						// thumbnail is off screen to the right
						if ( (thumbL + dd.thumbW + tL) > wW ) {
							
							dd.debug.html('thumb right:'+(thumbL + dd.thumbW + tL)+' wW:'+wW);
							
							newLeft = wW - (thumbL + dd.thumbW + parseInt(dd.thumbs.css('padding-left')))
							newLeft = (newLeft < dd.maxScroll) ? dd.maxScroll : (newLeft > 0) ? 0 : newLeft;
							dd.thumbs.stop(1,0).animate({'left':newLeft}, dd.settings.thumbsScrollSpeed);
							
						// thumbnail is off screen to the left
						} else if ( (thumbL + tL) < 0 ) {
							dd.debug.html('thumb left:'+(thumbL + tL)+' wW:'+wW);
							
							newLeft = 0 - thumbL;
							dd.thumbs.stop(1,0).animate({'left':newLeft}, dd.settings.thumbsScrollSpeed);
							
						};
						
						
						
					};
					
				});
					
				//////////////////
				// DOTNAV CLICK //
				//////////////////
				dd.gal.find('.ddGallery-dotNav a').on('click', function(){
					dd.thumbs.children('a:nth-child('+($(this).index()+1)+')').click();
				});
				
				//------------------------------------
				
				///////////////////////////
				// LEFT ARROW NAVIGATION //
				///////////////////////////
				dd.gal.on('click', '.ddGallery-arrow-left', function(e){
					e.preventDefault();
					dd.navSource = 'left';
					dd.rotateItems(false);
				});
				
				////////////////////////////
				// RIGHT ARROW NAVIGATION //
				////////////////////////////
				dd.gal.on('click', '.ddGallery-arrow-right', function(e){
					e.preventDefault();
					dd.navSource = 'right';
					dd.rotateItems(true);
				});
				
				//------------------------------------
				
				/////////////////////////
				// KEYBOARD NAVIGATION //
				/////////////////////////
				if (dd.settings.keyboard) {
					
					// bind to document object
					$(document).on('keydown.'+dd.id, function(e){
					
						switch (e.keyCode) {
							// left arrow
							case 37 :
								dd.navSource = 'left';
								dd.rotateItems(false);
								break;
							
							// right arrow
							case 39 :
								dd.navSource = 'right';
								dd.rotateItems(true);
								break;
							
							// escape
							case 27 :
								if (dd.fullScreen) {
									dd.full.click();
								};
								break;
						};
					});
					
				};
				
				//------------------------------------
				
				//////////////////////////
				// MOUSE ENTER: Gallery //
				//////////////////////////
				dd.gal.on('mouseenter', function(){
					var con=false, rs=false;
					
					dd.hover = true;
					
					// stop timers
					if ( (!dd.fullScreen && dd.settings.hoverPause) || (dd.fullScreen && dd.settings.hoverPauseOnFull) ) { clearTimeout(dd.rotator); };
					if (dd.captionDelay) { clearTimeout(dd.captionDelay); };
					
					// show arrows?
					if (dd.settings.arrows) {
						dd.gal.find('.ddGallery-arrows').stop(1,0).animate({'opacity':1}, dd.settings.arrowsHideSpeed);
					};
					
					// hide the count?
					if (dd.settings.count && (dd.settings.hideCount || (dd.settings.hideCountOnFull && dd.fullScreen))) {
						dd.count.stop(1,0).animate({'opacity':0}, dd.settings.thumbsHideSpeed);
					};
					
					// show the zoom?
					if (dd.thumbs.find('.selected').is('.img, .clickable')) { rs = dd.imageDimensions[dd.thumbs.find('.selected').attr('itemId')].o.z; };
					if (dd.settings.zoom && dd.settings.hideZoom && rs) {
						dd.showZoom(true, dd.settings.thumbsHideSpeed);
					};
					
					////////////////////////////////////////
					
					// ---MOVE CONTROLS---
					if (!dd.pinned) {
						
						// show controller?
						if (dd.settings.thumbs) { con = true; };
					
						// move controls
						dd.moveControls(con, true, dd.settings.thumbsHideSpeed);
					};
					
					////////////////////////////////////////
					
				});
				
				//////////////////////////
				// MOUSE LEAVE: Gallery //
				//////////////////////////
				dd.gal.on('mouseleave', function(){
					var con=false;
					
					// set hover state
					dd.hover = false;
					
					// restart timers
					if ((dd.settings.rotate || dd.userPlay) && ((!dd.fullScreen && dd.settings.hoverPause) || (dd.fullScreen && dd.settings.hoverPauseOnFull)) && !dd.videoPlaying && !dd.paused) {
						clearTimeout(dd.rotator);
						dd.rotator = setTimeout(function(){
							dd.navSource='auto';
							dd.rotateItems(true);
						}, dd.settings.stagePause);
					};
					
					// hide arrows?
					if (dd.settings.arrows && dd.settings.hideArrows) {
						dd.gal.find('.ddGallery-arrows').stop(1,0).animate({'opacity':0}, dd.settings.arrowsHideSpeed);
					};
					
					// show the count?
					if (dd.settings.count && (dd.settings.hideCount && !(dd.settings.hideCountOnFull && dd.fullScreen))) {
						dd.count.stop(1,0).animate({'opacity':1}, dd.settings.thumbsHideSpeed);
					};
					
					// hide the zoom?
					if (dd.settings.zoom && dd.settings.hideZoom ) {
						dd.showZoom(false, dd.settings.thumbsHideSpeed);
					};
					
					////////////////////////////////////////
					
					// ---MOVE CONTROLS---
					if (!dd.pinned) {
						
						// show controller?
						if ( dd.settings.thumbs && ((!dd.fullScreen && !dd.settings.hideThumbs) || (dd.fullScreen && !dd.settings.hideThumbsOnFull))) { con = true; };
					
						// move controls
						dd.moveControls(con, true, dd.settings.thumbsHideSpeed);
					
					};
					
					////////////////////////////////////////
					
					// ---CAPTION HIDE TIMER---
					dd.captionTimer(con);
					
					
				});
				
				/////////////////////////
				// MOUSE ENTER: Thumbs //
				/////////////////////////
				dd.thumbWrap.on('mouseover', function(){
					var pad = 50,
						wX = dd.thumbWrap.offset().left,
						wW = dd.thumbWrap.width();
						
					wX += pad;
					wW -= (pad*2);
						
					if (dd.maxScroll<0) {
							
						dd.thumbWrap.on('mousemove', function(e){
						
							var x = e.pageX - wX;
								nL = Math.ceil((x/wW)*dd.maxScroll);
							
							// sanity check
							nL = (nL<dd.maxScroll) ? dd.maxScroll : (nL>0) ? 0 : nL;

							dd.thumbs.css({'left':nL});
						
						});								
					};
				});
				
				/////////////////////////
				// MOUSE LEAVE: Thumbs //
				/////////////////////////
				dd.gal.on('mouseenter', function(){
					dd.thumbWrap.off('mousemove');
				});
	
				//------------------------------------
						
				///////////////
				// STAGE TAP //
				///////////////
				dd.stage.on('touchend', function(){
					
					// zoom on?
					if (dd.zoom.is('.active')) {

						/* do nothing */
					
					// zoom off?
					} else {
						clearTimeout(dd.touchy);
					
						// controls open?
						if (dd.touched) {
							dd.touched = false;
							dd.gal.mouseleave();

						// controls closed?
						} else {
							dd.touched = true;
							dd.gal.mouseenter();
							dd.touchy = setTimeout(function(){
								dd.touched = false;
								dd.gal.mouseleave();
							}, dd.settings.stagePause/2);
						};
					};
					
				});
								
				//------------------------------------
				
				/////////////////////////
				// THUMB SWIPE: Thumbs //
				/////////////////////////
				if (dd.settings.thumbs) {
					dd.thumbs.on('touchstart', function(event) {
						clearTimeout(dd.touchy);
						     // stop page from scrolling
						$(document).on('touchmove', function(event) {
							var e = event.originalEvent;
							e.preventDefault();
						});
						
						var e = event.originalEvent,
							tStartX = e.touches[0].pageX,
							nStartL = parseInt(dd.thumbs.css('left'));
						
						// watch touch movement
						dd.thumbs.on('touchmove', function(event) {
							var e = event.originalEvent,
								x = e.touches[0].pageX,
								nL = nStartL + (x - tStartX);
							
							// set min and max values
							nL = (nL < dd.maxScroll) ? dd.maxScroll : (nL > 0) ? 0 : nL;
							dd.thumbs.css({'left':nL});
						});

					});
					
					// de-initialize touch
					dd.thumbs.on('touchend', function(event) {
						$(document).off('touchmove');
						dd.arrowDisplay();
					});
				};
				
				//------------------------------------
				
				////////////////
				// ZOOM CLICK //
				////////////////
				dd.zoom.on('click', function(e){
					var image = dd.stage.find('.selected');
					
					if ( dd.animating || !image.is('img') ) { return; }
					
					// deactivate
					if (dd.zoom.is('.active')) {
						dd.zoom.removeClass('active');
						image.off();
						dd.setImageDimensions(image, '', '', 'unzoom');
					
					// activate
					} else {
						dd.zoom.addClass('active');
						
						// initialize
						var sW = dd.stage.width(),
							sH = dd.stage.height(),
							iW = dd.imageDimensions[image.attr('id')].o.w,
							iH = dd.imageDimensions[image.attr('id')].o.h,
						
							// calculate new image position based on cursor
							tW = Math.floor(sW * .6),
							tH = Math.floor(sH * .6),
							tX = Math.floor((sW - tW)/2) + dd.stage.offset().left,
							tY = Math.floor((sH - tH)/2) + dd.stage.offset().top,
							x = e.pageX - tX,
							y = e.pageY - tY;
						
						clearTimeout(dd.touchy);
						
						x = (e.pageX==undefined) ? Math.floor(tW/2) : (x>tW) ? tW : (x<0) ? 0 : x;
						y = (e.pageY==undefined) ? Math.floor(tH/2) : (y>tH) ? tH : (y<0) ? 0 : y;
							
						
						// animate to full size
						image.animate({
							'left' : ((iW>sW) ? (-1*Math.ceil((x/tW)*(iW-sW))) : Math.floor((sW-iW)/2) ),
							'top' : ((iH>sH) ? (-1*Math.ceil((y/tH)*(iH-sH))) : Math.floor((sH-iH)/2)),
							'width' : iW,
							'height' : iH							
						}, dd.settings.thumbsHideSpeed, function(){
							
							// watch mouse movement
							image.on('mousemove', function(e){
								
								var tX = Math.floor((sW - tW)/2) + dd.stage.offset().left,
									tY = Math.floor((sH - tH)/2) + dd.stage.offset().top,
									x = e.pageX - tX,
									y = e.pageY - tY;
									
								// set max and min movement
								x = (x>tW) ? tW : (x<0) ? 0 : x;
								y = (y>tH) ? tH : (y<0) ? 0 : y;
									
								// scroll horizontally
								if (iW > sW) {
									image.css({'left':-1*Math.ceil((x/tW)*(iW-sW))});
								};
								
								// scroll vertically
								if (iH > sH) {
									image.css({'top':-1*Math.ceil((y/tH)*(iH-sH))});
								};
							});
							
							// initialize touch
							image.on('touchstart', function(event) {
							
								// stop stage rotation timers
								clearTimeout(dd.rotator);
								
								// hide controls
								clearTimeout(dd.touchy);
								dd.touched = false;
								dd.gal.mouseleave();
								
								// stop page from scrolling
								$(document).on('touchmove', function(event) {
									var e = event.originalEvent;
									e.preventDefault();
								});
								
								// get initial touch position
								var e = event.originalEvent,
									tStartX = e.touches[0].pageX,
									tStartY = e.touches[0].pageY,
									iStartL = parseInt(image.css('left')),
									iStartT = parseInt(image.css('top'));
									
								
								// watch touchscreen movement
								image.on('touchmove', function(event){
									var e = event.originalEvent,
										x = e.touches[0].pageX,
										y = e.touches[0].pageY,
										nL = iStartL + (x - tStartX),
										nT = iStartT + (y - tStartY);
									
									// set min and max values
									nL = (nL < ((iW-sW)*-1)) ? ((iW-sW)*-1) : (nL > 0) ? 0 : nL;
									nT = (nT < ((iH-sH)*-1)) ? ((iH-sH)*-1) : (nT > 0) ? 0 : nT;
									
									// scroll horizontally
									if (iW > sW) {
										image.css({'left':nL});
									};
									
									// scroll vertically
									if (iH > sH) {
										image.css({'top':nT});
									};
								});
							});
							
							// de-initialize touch
							image.on('touchend', function(event) {
								$(document).off('touchmove');
								 
								// show controls
								dd.touched = true;
								dd.gal.mouseenter();
								dd.touchy = setTimeout(function(){
									dd.touched = false;
									dd.gal.mouseleave();
								}, dd.settings.stagePause/2);
								
							});
						});
						
					};
				});
				
				///////////////////////
				// FULL SCREEN CLICK //
				///////////////////////
				dd.full.on('click', function() {
					
					// turn off
					if (dd.fullScreen) {
						$('body').css({'overflow':dd.origBody});
						dd.full.removeClass('active');
						if (!dd.settings.fullScreen) {
							dd.showFullScreen(false, dd.settings.thumbsHideSpeed);
						};
						dd.fullScreen = false;
						dd.resizeMe(false);
					
					// turn on
					} else {
						$('body').css({'overflow':'hidden'});
						dd.full.addClass('active');
						dd.showFullScreen(true, dd.settings.thumbsHideSpeed);
						dd.fullScreen = true;
						dd.resizeMe(true);
						dd.thumbs.css({'left':0});
					};
				});
				
				//------------------------------------
				
				///////////////
				// TAB CLICK //
				///////////////
				dd.tab.on('mouseup touchend', function(){
					var con=false;
					clearTimeout(dd.tabTouchy);
					dd.tabTouchy = setTimeout(function(){
						
						// unpin
						if (dd.pinned) {
							dd.pinned = false;
							dd.tab.removeClass('pinned');
							dd.autopinned=false;
							if (dd.hover) {
								dd.gal.mouseenter();
							} else {
								dd.gal.mouseleave();
							};
						
						// pin
						} else {
							dd.pinned = true;
							dd.tab.addClass('pinned');
							dd.touched=false;
							
							// don't pin the controls?
							if ( dd.settings.thumbs && ((!dd.fullScreen && dd.settings.thumbsPush && !dd.settings.hideThumbs) || (dd.fullScreen && dd.settings.thumbsPushOnFull)) ) { con=true; };
							
							// move the controls
							dd.moveControls(con, false, dd.settings.thumbsHideSpeed);
						};
					}, 100);
				});
				
				//------------------------------------
				
				///////////////////
				// WINDOW RESIZE //
				///////////////////
				$(window).on('resize.'+dd.id, function(){
					clearTimeout(dd.windowResizer);
					dd.windowResizer = setTimeout(function(){
						if (!dd.fullScreen) {
							dd.gal.css({
								'z-index':'',
								'position':'',
								'top':'',
								'left':'',
								'width':'',
								'height':'',
								'margin':''				
							});
							dd.origCSS = {
								'z-index':dd.gal.css('z-index'),
								'position': (dd.gal.css('position') == 'static') ? 'relative' : dd.gal.css('position'),
								'top':dd.gal.css('top'),
								'left':dd.gal.css('left'),
								'width':dd.gal.css('width'),
								'height':dd.gal.css('height'),
								'margin':dd.gal.css('margin')				
							};
							dd.gal.css(dd.origCSS);
						};
						dd.resizeMe(dd.fullScreen);
						
					}, 100);
				});
						
				
			});
		},		
		
		//------------------------------------
		
		///////////////////////
		// ANIMATION: FINISH //
		///////////////////////
		animFinish : function(item) {
			var dd = this;

			// unbind all zooms
			dd.stage.find('img').off();
			dd.zoom.removeClass('active');
			
			// remove flag
			dd.animating = false;
					
			// restart timer
			if ((dd.settings.rotate || dd.userPlay) && (!dd.hover || (!dd.fullScreen && !dd.settings.hoverPause) || (dd.fullScreen && !dd.settings.hoverPauseOnFull)) && !dd.paused) {
				dd.rotator = setTimeout(function(){
					dd.navSource='auto';
					dd.rotateItems(true);
				}, dd.settings.stagePause);
			};
			
			// no longer initial item
			dd.initial=false;
			
		},
		
		//----------------------
		
		/////////////////////
		// ANIMATION: FADE //
		/////////////////////
		animOut_fade : function(item, type, typeFrom, dir) {
			var dd = this;
			item.stop(1,0).animate({'opacity':0}, dd.settings.stageRotateSpeed, function(){
				item.css({'display':'none'}).removeClass('selected');
			});
		},
		animIn_fade : function(item, type, typeFrom, dir) {
			var dd = this;
			item.stop(1,0).css({'display':'block','opacity':0}).animate({'opacity':1}, (dd.initial?dd.initialSpeed:dd.settings.stageRotateSpeed), function(){
				dd.animFinish(item);
			});
		},
		
		///////////////////////
		// ANIMATION: pushH //
		///////////////////////
		animOut_pushH : function(item, type, typeFrom, dir) {
			var dd = this,
				m=dd.stage.width(),
				nL=(parseInt(item.css('left'))||0);
			if (dir) { m = m*-1; };
			item.stop(1,0).animate({'left':nL+m}, dd.settings.stageRotateSpeed, function(){
				item.css({'display':'none','left':0}).removeClass('selected');
			});
		},
		animIn_pushH : function(item, type, typeFrom, dir) {
			var dd = this,
				m=dd.stage.width(),
				oL=(parseInt(item.css('left'))||0);
			oL = (oL>m || oL<0)? 0 : oL;
			if (!dir) { m = m*-1; };
			item.stop(1,0).css({'display':'block','opacity':1,'left':m}).animate({'left':oL}, (dd.initial?dd.initialSpeed:dd.settings.stageRotateSpeed), function(){
				dd.animFinish(item);
			});
		},
		
		///////////////////////
		// ANIMATION: pushV //
		///////////////////////
		animOut_pushV : function(item, type, typeFrom, dir) {
			var dd = this,
				m=dd.stage.height(),
				nT=(parseInt(item.css('top'))||0);
			if (dir) { m = m*-1; };
			item.stop(1,0).animate({'top':nT+m}, dd.settings.stageRotateSpeed, function(){
				item.css({'display':'none','top':0}).removeClass('selected');
			});
		},
		animIn_pushV : function(item, type, typeFrom, dir) {
			var dd = this,
				m=dd.stage.height(),
				oT=(parseInt(item.css('top'))||0);
			oT = (oT>m || oT<0)? 0 : oT;
			if (!dir) { m = m*-1; };
			item.stop(1,0).css({'display':'block','opacity':1,'top':m}).animate({'top':oT}, (dd.initial?dd.initialSpeed:dd.settings.stageRotateSpeed), function(){
				dd.animFinish(item);
			});
		},
		
		///////////////////////
		// ANIMATION: slideH //
		///////////////////////
		animOut_slideH : function(item, type, typeFrom, dir) {
			var dd = this;
			item.css({'z-index':dd.mainZ});
			dd.animOut_fade(item, type, typeFrom, dir);
		},
		animIn_slideH : function(item, type, typeFrom, dir) {
			var dd = this;
			item.css({'z-index':dd.mainZ+1});
			dd.animIn_pushH(item, type, typeFrom, dir);
		},
		
		///////////////////////
		// ANIMATION: slideV //
		///////////////////////
		animOut_slideV : function(item, type, typeFrom, dir) {
			var dd = this;
			item.css({'z-index':dd.mainZ});
			dd.animOut_fade(item, type, typeFrom, dir);
		},
		animIn_slideV : function(item, type, typeFrom, dir) {
			var dd = this;
			item.css({'z-index':dd.mainZ+1});
			dd.animIn_pushV(item, type, typeFrom, dir);
		},
		
		/////////////////////
		// ANIMATION: lift //
		/////////////////////
		animOut_lift : function(item, type, typeFrom, dir) {
			var dd = this,
				oW, oH, oL, oT,
				nW, nH, nL, nT;

			item.css({'z-index':dd.mainZ+1});

			// only works with images
			if (typeFrom=='img' || typeFrom=='img selected'
				|| typeFrom=='clickable' || typeFrom=='clickable selected') { 
				oW = item.width();
				oH = item.height();
				oL = parseInt(item.css('left'));
				oT = parseInt(item.css('top'))
				
				nW = Math.ceil(oW * 2);
				nH = Math.ceil(oH * 2);
				nL = Math.ceil(oL - ((nW-oW)/2));
				nT = Math.ceil(oT - ((nH-oH)/2));

				item.stop(1,0).animate({'width':nW,'height':nH, 'left':nL, 'top':nT, 'opacity':0}, dd.settings.stageRotateSpeed, function(){
					item.css({'width':oW,'height':oH, 'left':oL, 'top':oT,'display':'none'}).removeClass('selected');
				});
			
			} else {
				dd.animOut_fade(item, type, typeFrom, dir);
			};
				
		},
		animIn_lift : function(item, type, typeFrom, dir) {
			var dd = this;
			item.css({'z-index':dd.mainZ});
			this.animIn_fade(item, type, typeFrom, dir);
		},
		
		/////////////////////
		// ANIMATION: drop //
		/////////////////////
		animOut_drop : function(item, type, typeFrom, dir) {
			var dd = this;
			item.css({'z-index':dd.mainZ});
			dd.animOut_fade(item, type, typeFrom, dir);				
		},
		animIn_drop : function(item, type, typeFrom, dir) {
			var dd = this,
				oW, oH, oL, oT,
				nW, nH, nL, nT;

			item.css({'z-index':dd.mainZ+1});

			// only works with images
			if (typeFrom=='img' || typeFrom=='img selected'
				|| typeFrom=='clickable' || typeFrom=='clickable selected') { 
				oW = item.width();
				oH = item.height();
				oL = parseInt(item.css('left'));
				oT = parseInt(item.css('top'))
				
				nW = Math.ceil(oW * 2);
				nH = Math.ceil(oH * 2);
				nL = Math.ceil(oL - ((nW-oW)/2));
				nT = Math.ceil(oT - ((nH-oH)/2));

				item.stop(1,0).css({'display':'block','width':nW,'height':nH, 'left':nL, 'top':nT, 'opacity':0}).animate({'width':oW,'height':oH, 'left':oL, 'top':oT,'opacity':1},  (dd.initial?dd.initialSpeed:dd.settings.stageRotateSpeed), function(){
					dd.animFinish(item);
				});
			
			} else {
				dd.animIn_fade(item, type, typeFrom, dir);
			};
		},
		
		//------------------------------------
		
		//////////////////
		// RESIZE STAGE //
		//////////////////
		resizeMe : function(full) {
			var dd = this,
				cur = dd.stage.find('.selected');
			
			// if animating... finish immediately, before resize
			dd.stage.find('.ddGallery-item').stop(1,1);
			
			// set gallery wrapper options
			if (full) {
				dd.gal.css({
					'z-index':10000,
					'position':'fixed',
					'top':0,
					'left':0,
					'width':$(window).width(),
					'height':$(window).height(),
					'margin':0
				}).addClass('fullScreen');
			} else {
				dd.gal.css(dd.origCSS).removeClass('fullScreen');
			};
			
			// set stage height
			dd.stageWrap.height( (dd.settings.thumbsPush || (dd.settings.thumbsPushOnFull && dd.fullScreen)) ? dd.gal.height()-dd.controlH : dd.gal.height() );
			
			// reposition tab
			if (dd.settings.pinTab) {
				dd.tab.css({
					'left' : Math.floor(dd.stage.width()/2) - Math.floor(dd.tab.outerWidth()/2)
				});
			};
			
			// reset thumb max scroll
			if (dd.settings.thumbs) {
				dd.maxScroll = dd.thumbWrap.outerWidth() - dd.thumbs.outerWidth();
			};
			
			// redraw arrows
			if (dd.settings.arrows) {
				dd.positionArrows();
			};
			
			// unzoom if zoomed
			if (dd.zoom.is('.active')) {
				dd.zoom.click();
			};
			
			// resize current item
			if ( cur.is('img') ) {
				dd.setImageDimensions(cur, '', '', 'resize');
			};
				
		},
		
		////////////////////
		// POSITON ARROWS //
		////////////////////
		positionArrows : function() {
			var dd = this,
				aW, aH, box, top;
			
			// arrows are disabled
			if (!dd.settings.arrows) {
				dd.gal.find('.ddGallery-arrows').css({'display':'none'});
				return;
			};				
			
			// get arrow dimensions
			dd.navW = dd.gal.find('.ddGallery-arrows').width();
			dd.navH = dd.gal.find('.ddGallery-arrows').height();
			box = Math.floor( ( (dd.navW > dd.navH) ? dd.navH : dd.navW) * 0.75);
			
			// build arrows
			aW = Math.ceil(box * 0.6); // arrow width
			aH = Math.ceil((aW * 1.1)/2); // arrow height
			
			dd.gal.find('.ddGallery-arrows .arrow').css({
				'top' : Math.floor((dd.navH/2)-(aH)),
				'left' : Math.floor(((dd.navW/2)-(aW/2)-(aW*0.1))),
				'border-left-width' : '0',
				'border-top' : 'solid transparent '+aH+'px',
				'border-bottom' : 'solid transparent '+aH+'px',
				'border-right-style' : 'solid',
				'border-right-width' : aW+'px'
			});
			
			dd.gal.find('.ddGallery-arrow-right .arrow').css({
				'left' : Math.floor(((dd.navW/2)-(aW/2))+(aW*0.1)),
				'border-right' : 'solid 0 transparent',
				'border-left-style' : 'solid',
				'border-left-width' : aW+'px'
			});
			
			// place arrow buttons
			top = Math.floor((dd.stageWrap.height()/2)-(dd.navH/2));			
			dd.gal.find('.ddGallery-arrow-left').css({'top' : top});
			dd.gal.find('.ddGallery-arrow-right').css({'top' : top});
			
		},
		
		//////////////////////////
		// SET IMAGE DIMENSIONS //
		//////////////////////////
		setImageDimensions : function(image, typeFrom, dir, target) {
			var dd = this,
				clickable = false,
				itemId = image.attr('id'),
				iW, iH, iR,
				orig,
				sW, sR,
				nW, nH, speed;
			
			// store original dimensions for a resize
			if (target=='resize') {
				orig = {
					'width':image.css('width'),
					'height':image.css('height'),
					'top':image.css('top'),
					'left':image.css('left')
				};
			};			
			
			// reset dimensions to get full size
			image.css({'width':'','height':''});
			
			iW = image.width();
			iH = image.height();
			iR = iW/iH;

			sW = dd.stage.width();
			sH = dd.stage.height();
			sR = sW/sH;
				
			// store original dimensions (for zoom)
			dd.imageDimensions[itemId] = {o:{
				w : iW,
				h : iH,
				z : ((iW>sW)||(iH>sH))
			},n:{}};
			
			// enable image zoom?
			if (dd.settings.zoom) {
				dd.zoom.removeClass('active');
				if ( ((iH>sH) || (iW>sW)) && (dd.hover || !dd.settings.hideZoom) ) {
					dd.showZoom(true, dd.settings.stageRotateSpeed);
				} else {
					dd.showZoom(false, dd.settings.stageRotateSpeed);
				};
			};			
			
			// should the image be stretched?
			if (dd.settings.stretch) {
				iW = sW;
				iH = sH;
			
			
			// should the image be resized?
			} else if ( ((iH>sH) || (iW>sW)) || (((iH < sH) && (iW < sW)) && dd.settings.enlarge) ) {
				
				// if stage is wider relative to image, change height first
				if (sR > iR) {
					nH = sH;
					iW = Math.round(iW * (nH/iH));
					iH = nH;
												
				// if stage is taller relative to image, change width first
				} else {
					nW = sW;
					iH = Math.round(iH * (nW/iW));
					iW = nW;
				};
				
				// store resized dimensions (for zoom)
				dd.imageDimensions[itemId].n = {
					w : iW,
					h : iH
				};	
			};
						
			// place image
			switch (target) {
				
				// object should be placed immediately
				case 'in' :
					speed = 0;
					break;
				
				// reset original dimensions for a resize
				case 'resize' :
					image.css(orig);
					speed = 0;
					break;
				
				// animate to resized position
				case 'unzoom' :
					speed = dd.settings.thumbsHideSpeed;
					break;			
			};
				
			image.animate({'width':iW, 'height':iH, 'left':((sW/2)-(iW/2)), 'top':((sH/2)-(iH/2)), 'display':'block'}, speed, function(){
				if (clickable) { image = image.parent('a'); };
				if (target=='in') { eval('dd.animIn_'+dd.settings.stageRotateType+'(image,"img",typeFrom,dir);'); };
			});
		},
		
		////////////////////
		// SHOW/HIDE ZOOM //
		////////////////////
		showZoom : function(show, speed) {
			var dd = this,
				s = ((dd.zoom.css('display')=='block') ? 1 : 0),
				o = (show?1:0),
				d = (show?'block':'none');
			
			dd.zoom.css({'display':'block','opacity':s}).animate({'opacity':o}, speed, function(){
				dd.zoom.css({'display':d,'opacity':''});
			});
		},

		///////////////////////////
		// SHOW/HIDE FULL SCREEN //
		///////////////////////////
		showFullScreen : function(show, speed) {
			var dd = this,
				s = ((dd.full.css('display')=='block') ? 1 : 0),
				o = (show?1:0),
				d = (show?'block':'none');
			
			dd.full.css({'display':'block','opacity':s}).animate({'opacity':o}, speed, function(){
				dd.full.css({'display':d,'opacity':''});
			});
		},

		///////////////////
		// MOVE CONTROLS //
		///////////////////
		moveControls : function(con, cap, speed) {
			var dd = this,
				id = dd.caption.attr('itemId'),
				conH=0,
				capH=0;
			
			// move the controller
			if (con) { conH = dd.controlH; };
			dd.thumbWrap.stop(1,0).animate({'bottom':(conH - dd.controlH)}, speed);
			
			// move caption
			if (dd.settings.captions){
				dd.caption.stop(1,0).css({'opacity':1});
				if (cap & dd.capSizes.heights[id]['h']>0) {
					capH = dd.capSizes.heights[id]['o'];
					dd.caption.animate({
						'bottom' : conH,
						'height' : dd.capSizes.heights[id]['h'],
						'margin-top' : dd.capSizes.margins['t'],
						'margin-bottom' : dd.capSizes.margins['b'],
						'padding-top' : dd.capSizes.padding['t'],
						'padding-bottom' : dd.capSizes.padding['b'],
						'border-top-width' : dd.capSizes.borders['t'],
						'border-bottom-width' : dd.capSizes.borders['b']
					}, speed).removeClass('collapsed');
				} else {
					dd.caption.animate({
						'height' : 0,
						'bottom' : conH,
						'margin-top' : 0,
						'margin-bottom' : 0,
						'padding-top' : 0,
						'padding-bottom' : 0,
						'border-top-width' : 0,
						'border-bottom-width' : 0
					}, speed).addClass('collapsed');;
				};
			};
			
			// move tab
			if (dd.settings.pinTab) {
				dd.tab.stop(1,0).animate({'bottom': dd.tabB + conH + capH}, speed);			
			};
		},	
		
		//////////////////
		// ROTATE ITEMS //
		//////////////////
		rotateItems : function(forward) {
			var dd = this, n=dd.curItem;
			
			if (forward){
				n = ((n+1) <= dd.itemCount) ? n+1 : 1;
			} else {
				n = ((n-1) >= 1) ? n-1 : dd.itemCount;
			};
			dd.thumbs.children('a:nth-child('+n+')').click();
		},
		
		///////////////////
		// CAPTION TIMER //
		///////////////////
		captionTimer : function(showControls) {
			var dd = this;
			if (!dd.pinned && dd.settings.captions && ((!dd.fullScreen && dd.settings.hideCaptions) || (dd.fullScreen && dd.settings.hideCaptionsOnFull))) {
				clearTimeout(dd.captionDelay);
				dd.captionDelay = setTimeout(function(){
					dd.moveControls(showControls, false, dd.settings.captionHideSpeed);			
				}, dd.settings.captionPause);
			};
		},
		
		//------------------------------------

		///////////////////////////
		// DESTROY THIS INSTANCE //
		///////////////////////////
		destroy : function() {
			var dd = this;
			
			// clear listeners
			dd.gal.off();
			$(document).off('keydown.'+dd.id);
			
			// stop timer
			clearTimeout(dd.rotator);
			
			// stop any animations
			dd.gal.find().stop(1,0);
			
			// replace original data
			$(dd.settings.externalCaptions).html('');
			dd.gal.html(dd.origData);
			
			dd.debug.html('');
		}
	};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

	/////////////////
	// PLUGIN CALL //
	/////////////////
	$.fn.ddGallery = function(options, goTo) { 
		var control='load';
		
		// listen for external controls
		switch (options) {
			
			case 'goTo' :
			case 'togglePlay' :
			case 'play' :
			case 'pause' :
			case 'last' :
			case 'next' :
			case 'fullScreen' :
			case 'zoom' :
			case 'showControls' :
			case 'hideControls' :
			case 'toggleControls' :
				control = options;
				break;
			
			// get user options
			case 'destroy' :
			default :
				var args = (typeof options === 'object' || !options ) ? options : arguments[1];
				break;
		};
		
		// loop through supplied elements
		this.each(function(){
			// retrieve existing instance
			var dd = $(this).data('ddGallery');
			
			switch (control) {
			
				// LOAD OR RELOAD OR DESTROY
				case 'load' :
				case 'reload' :
				case 'destroy' :
					
					// destroy instance if exists
					if (dd) {
						dd['destroy'].apply( dd );
						$(this).removeData('ddGallery');
					};
					
					// (re)create instance?
					if ( options != 'destroy' ) {
						$(this).data('ddGallery', new $.ddGallery(this, args));
					};
					
					break;
					
				// GO TO
				case 'goTo' :
					goTo = (goTo>dd.itemCount) ? itemCount : (goTo<1) ? 1 : goTo;
					dd.thumbs.children('a:nth-child('+goTo+')').click();
					break;
				
				// NEXT
				case 'next' :
					dd['rotateItems'].call(dd, true);					
					break;
					
				// LAST
				case 'last' :
					dd['rotateItems'].call(dd, false);					
					break;
					
				// PLAY
				case 'play' :
					if (dd.paused || (!dd.settings.rotate && !dd.userPlay)) {
						dd.userPlay = true;
						dd.paused = false;
						if ( (!dd.hover || (!dd.fullScreen && !dd.settings.hoverPause) || (dd.fullScreen && !dd.settings.hoverPauseOnFull)) ) {
							dd.rotator = setTimeout(function(){
								dd.navSource='auto';
								dd.rotateItems(true);
							}, dd.settings.stagePause);
						};
					};
					break;
				
				// PAUSE
				case 'pause' :
					if (!dd.paused) {
						clearTimeout(dd.rotator);
						dd.paused = true;
						dd.userPlay = false;
					};
					break;
				
				// TOGGLE PLAY	
				case 'togglePlay' :
					if (dd.paused || (!dd.settings.rotate && !dd.userPlay)) {
						// restart timer
						if ( (!dd.hover || (!dd.fullScreen && !dd.settings.hoverPause) || (dd.fullScreen && !dd.settings.hoverPauseOnFull)) ) {
							dd.userPlay = true;
							dd.paused = false;
							dd.rotator = setTimeout(function(){
								dd.navSource='auto';
								dd.rotateItems(true);
							}, dd.settings.stagePause);
						};
					
					} else if (!dd.paused) {
						clearTimeout(dd.rotator);
						dd.paused = true;
						dd.userPlay = false;
					};
					break;
				
				// FULL SCREEN	
				case 'fullScreen' :
					dd.full.click();
					break;
				
				// ZOOM	
				case 'zoom' :
					dd.zoom.click();
					break;
					
				// HIDE CONTROLS
				case 'hideControls' :
					if (!dd.pinned) {
						dd.tab.mouseup();
					};
					break;
				
				// SHOW CONTROLS
				case 'showControls' :
					if (dd.pinned) {
						dd.pinned = false;
						dd.tab.removeClass('pinned');
						dd.autopinned=false;
					};
					dd.moveControls(true, true, dd.settings.thumbsHideSpeed);
					break;
				
				// TOGGLE CONTROLS	
				case 'toggleControls' :
					if (!dd.pinned) {
						dd.tab.mouseup();
					} else {
						dd.pinned = false;
						dd.tab.removeClass('pinned');
						dd.autopinned=false;
						dd.moveControls(true, true, dd.settings.thumbsHideSpeed);
					};
					break;
					
			};
			
		});
		return this;				
    
	};
			
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
	
	
})( jQuery );
