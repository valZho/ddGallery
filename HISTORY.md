Title: ddGallery Version History
Author: Darren Doyle

### v3.1 :: 2012-04-17
* [add] thumbnail numbering + requisite CSS + thumbsNumbers option
* [add] dot navigation numbering + requisite CSS + dotNavNumbers option
* [add] separate hide speed setting for arrows
* [ref] minor edits to default CSS style
* [ref] change controlHideSpeed to thumbsHideSpeed for consistency
* [ref] change controlScrollSpeed to thumbsScrollSpeed for consistency
* [ref] change controlPush to thumbsPush for consistency
* [ref] change captionFadeSpeed to captionHideSpeed for consistency
* [fix] minor improvements to CSS in gallery template

### v3.0.1 :: 2012-04-16
* [fix] lift and drop animation not working with clickable images

### v3.0 :: 2012-04-16
* [add] dot navigation & requisite options
* [ref] navigation arrows completely refactored to work independently of control thumbs and be more customizable
* [ref] control thumbnails completely refactored to scroll with mouse hover
* [ref] HTML and style overhauls to allow for overflowed buttons
* [ref] changed to count to off by default
* [fix] minor bug fixes affecting animation

### v2.6.2 :: 2012-04-05
* [fix] pin tab function bugs with full screen

### v2.6.1 :: 2012-04-05
* [add] startItem option (select initial item to load)
* [fix] watch for mouse hover on startup 

### v2.6 :: 2012-04-05
* [add] external control: goTo
* [add] fullScreen class toggle to main element to target gallery during fullscreen (specifically: need to add background during fullscreen)
* [add] default CSS file updates and additions
* [ref] stage drawing rewrite so that contents do not overlap controller on controlPush
* [ref] caption drawing, external and internal captions can now be enabled independently of each other
* [ref] set body to overflow:hidden on fullscreen to remove scroll bars and prevent background scrolling
* [fix] layering of elements for new stage drawing method & full screen issues
* [fix] zoom and fullScreen external controls to work when those controllers are hidden in gallery
* [fix] iframe double scroll bar

### v2.5 :: 2012-04-04
* [add] external controls: play, pause, playToggle, last, next, zoom, fullScreen, hideControls, showControls, toggleControls

### v2.4.5 :: 2012-04-02
* [add] use ESC key to exit full screen mode
* [fix] DIV sizing / selection bug

### v2.4.4 :: 2012-04-02
* [fix] YouTube API loading w/ Firefox

### v2.4.3 :: 2012-03-30
* [fix] bugs with full screen options

### v2.4.2 :: 2012-03-30
* [add] extra fullScreen options
* [fix] bugs with zoom and full screen buttons

### v2.4.1 :: 2012-03-28
* [fix] bugs relating to resizability

### v2.4 :: 2012-03-27
* [add] full window mode
* [add] resizability

### v2.3 :: 2012-03-23
* [add] clickable image support
* [add] touchscreen support
* [ref] change .live() calls to .on()
* [fix] disappearing arrows bug
* [fix] direction of some slide/push animations incorrect
			
### v2.2.2 :: 2012-03-19
* [fix] YouTube link parsing bug
* [fix] iframe/youtube/vimeo scrollbars
			
### v2.2.1 :: 2012-03-19
* [add] CSS3 PIE added to default CSS
* [add] hideZoom option
* [fix] minor bug fixes
			
### v2.2 :: 2012-03-14 Pi Day!
* [add] image zoom
			
### v2.1.1 :: 2012-03-14 Pi Day!
* [fix] empty thumbnail js warning
			
### v2.1 :: 2012-03-13
* [add] minimal Vimeo support
* [add] animation: pushH
* [add] animation: pushV
* [add] animation: slideH
* [add] animation: slideV
* [add] animation: lift
* [add] animation: drop
* [fix] minor bug fixes
			
### v2.0 :: 2012-03-12
* [add] YouTube support
* [add] control panel pinning
* [add] ability to use &lt;iframe&gt;
* [ref] refactored and cleaned much code
* [fix] fixed thumb scroll bug
			
### v1.1 :: 2012-02-29 Leap Day!
* [add] ability to use &lt;div&gt;
* [add] ability to use &lt;img&gt;
* [add] ability to use &lt;iframe&gt;
* [add] item count & options
* [add] single-item handling
* [ref] some code cleanup and optimization
			
### v1.0 :: 2012-02-22
* :: initial release