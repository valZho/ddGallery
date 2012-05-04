Title: ddGallery Version History
Author: Darren Doyle

### v3.6.6 :: 2012-05-04
* [ref] minor refinement to caption fade-in/out

### v3.6.5 :: 2012-05-02
* [fix] arrow drawing issues in IE6-7

### v3.6.4 :: 2012-05-02
* [add] refinements to the captions: fade in/out text on caption change
* [ref] refinements to caption CSS to better support multi-line captions

### v3.6.3 :: 2012-04-27
* [fix] refined YouTube url parser

### v3.6.2 :: 2012-04-24
* [fix] control wrapper not collapsing properly
* [fix] minor adjustments to css themes


### v3.6.1 :: 2012-04-20
* [add] external command: "resize"

### v3.6 :: 2012-04-20
* [add] scale to fill option for images

### v3.5 :: 2012-04-20
* [ref] unpin controls when full screen mode toggled
* [ref] more improvements and optimizations to resizing listeners
* [ref] significant CSS3PIE support optimizations and improvements
* [ref] completely refactored arrows for better cross-browser compatibility
* [ref] refactored CSS to support new arrows
* [ref] improvements to dotNav logic
* [fix] fixed loading image for minimalist: dark theme
* [fix] full screen mode now accommodates border and padding widths on main gallery
* [fix] caption still hiding while mouse hover

### v3.3 :: 2012-04-19
* [add] animation style: random
* [ref] streamlined external command parser
* [ref] streamlined animation sanity check
* [ref] rewrote container/window resize listener, should be more robust
* [fix] more default CSS fixes and refinements

### v3.2 :: 2012-04-18
* [ref] minor change to caption structure to accommodate IE
* [fix] a few IE bug fixes
* [fix] fixed CSS issue in gallery template preventing setting the vertical positioning of control tab
* [fix] more default CSS fixes and refinements

### v3.1.1 :: 2012-04-18
* [add] add unused watermark references to default CSS to make it easier for editors to target
* [ref] cleaned up CSS code and added version header
* [fix] minor IE fixes in JavaScript

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