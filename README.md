# YTPlayerWrapper
Simple wrapper around YT video player to collect video stats and show slides


#Usage
```
<div class="row">
 <div class="col-lg-6">
   <div id="ytplayer"></div>
 </div>
 <div class="col-lg-6">
   <div class="player-sidebar"></div>
 </div>
 </div>
<script>
$('#ytplayer').YTPlayer({
        // Basic setting
        width: 800,                // video width
        //height: 560,                // video height
        videoId: 'OPf0YbXqDm0',     // youtube video id

        // onReady: function(){alert("VIDEO READY")},      // on video ready
        // onPlay: function(){alert("VIDEO STARTED")},
        //  onPause: function(){alert("VIDEO PAUSED")},
        //onEnd: function(){alert("VIDEO ENDED")},
        //onBuffer: function(){alert("VIDEO BUFFERING")},     // on video buffer
        sidebar: $('.player-sidebar'),
        // Player variables
        playerVars: {
            autohide: 2,            // Values: 2 (default), 1, and 0. This parameter indicates whether the video controls will automatically hide after a video begins playing
            autoplay: 0,            // Values: 0 or 1. Default is 0. Sets whether or not the initial video will autoplay when the player loads.
            cc_load_policy: 1,      // Values: 1. Default is based on user preference. Setting to 1 will cause closed captions to be shown by default, even if the user has turned captions off.
            color: 'red',           // Valid parameter values are red and white, and, by default, the player will use the color red in the video progress bar.
            disablekb: 0,           // Values: 0 or 1. Default is 0. Setting to 1 will disable the player keyboard controls
            enablejsapi: 1,         // Values: 0 or 1. Default is 0. Setting this to 1 will enable the Javascript API
            fs: 1,                  // Values: 0 or 1. The default value is 1, which causes the fullscreen button to display. Setting this parameter to 0 prevents the fullscreen button from displaying
            hl: 'en',               // Sets the player's interface language
            iv_load_policy: 3,      // Values: 1 or 3. Default is 1. Setting to 1 will cause video annotations to be shown by default, whereas setting to 3 will cause video annotations to not be shown by default
            modestbranding: 1,      // This parameter lets you use a YouTube player that does not show a YouTube logo. Set the parameter value to 1 to prevent the YouTube logo from displaying in the control bar
            origin: '',             // This parameter provides an extra security measure for the IFrame API and is only supported for IFrame embeds. If you are using the IFrame API, which means you are setting the enablejsapi parameter value to 1, you should always specify your domain as the origin parameter value
            playsinline: 0,         // This parameter controls whether videos play inline or fullscreen in an HTML5 player on iOS
            rel: 1,                 // Values: 0 or 1. Default is 1. This parameter indicates whether the player should show related videos when playback of the initial video ends
            showinfo: 1,            // Values: 0 or 1. The parameter's default value is 1. If you set the parameter value to 0, then the player will not display information like the video title and uploader before the video starts playing
            theme: 'dark'           // This parameter indicates whether the embedded player will display player controls (like a play button or volume control) within a dark or light control bar. Valid parameter values are dark and light
        },

        fragments: [
            {
                from: '00:00:02',
                to: '00:00:05'
            },
            {
                from: '00:00:03',
                to: '00:00:10'
            }
        ],

        slides: [
            {
                from: '00:00:03',
                to: '00:00:07',
                content: "<h2>This is a slide from 00:00:03 to 00:00:07!</h2>"
            },
            {
                from: '00:00:08',
                to: '00:00:15',
                content: "<h2>This is a slide from 00:00:08 to 00:00:15!</h2>"
            }
        ]

    });
 </script>
```

#Demo
You can also view a [Live Demo here](http://sheldonfar.com/ytapi)
