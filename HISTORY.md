Title: ddGallery Version History
Author: Darren Doyle

### v2.6 :: 2012-04-05
* + Add external control: goTo
* + rewrite stage drawing so that contents do not overlap controller on controlPush
* + rewrite caption drawing, external and internal captions can now be enabled independently of each other
* + add fullScreen class toggle to main element to target gallery during fullscreen (specifically: need to add background during fullscreen)
* + additions / improvements to the default CSS file
* x set body to overflow:hidden on fullscreen to remove scroll bars and prevent background scrolling
* x fix layering of elements for new stage drawing method & full screen issues
* x fix zoom and fullScreen external controls to work when those controllers are hidden in gallery
* x fix iframe double scroll bar

### v2.5 :: 2012-04-04
* + Add external controls: play, pause, playToggle, last, next, zoom, fullScreen, hideControls, showControls, toggleControls

### v2.4.5 :: 2012-04-02
* + add use ESC key to exit full screen mode
* x fix DIV sizing / selection bug

### v2.4.4 :: 2012-04-02
* x fix YouTube API loading w/ Firefox

### v2.4.3 :: 2012-03-30
* x fix bugs with full screen options

### v2.4.2 :: 2012-03-30
* + add extra fullScreen options
* x fix bugs with zoom and full screen buttons

### v2.4.1 :: 2012-03-28
* + fix bugs relating to resizability

### v2.4 :: 2012-03-27
* + full window mode
* + resizability

### v2.3 :: 2012-03-23
* + clickable image support
* + touchscreen support
* + change .live() calls to .on()
* x fix disappearing arrows bug
* x fix direction of some slide/push animations
			
### v2.2.2 :: 2012-03-19
* x fix YouTube link parsing bug
* x fix iframe/youtube/vimeo scrollbars
			
### v2.2.1 :: 2012-03-19
* + CSS3 PIE added to default CSS
* + hideZoom option
* x minor fixes
			
### v2.2 :: 2012-03-14 Pi Day!
* + image zoom
			
### v2.1.1 :: 2012-03-14 Pi Day!
* x fix: empty thumbnail js warning
			
### v2.1 :: 2012-03-13
* + minimal Vimeo support
* + animation: pushH
* + animation: pushV
* + animation: slideH
* + animation: slideV
* + animation: lift
* + animation: drop
* x minor bug fixes
			
### v2.0 :: 2012-03-12
* + YouTube support
* + control panel pinning
* + ability to use &lt;iframe&gt;
* x fixed thumb scroll bug
* x refactored and cleaned much code
			
### v1.1 :: 2012-02-29 Leap Day!
* + ability to use &lt;div&gt;
* + ability to use &lt;img&gt;
* + ability to use &lt;iframe&gt;
* + item count & options
* + single-item handling
* x some code cleanup and optimization
			
### v1.0 :: 2012-02-22
* :: initial release