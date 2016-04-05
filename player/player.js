(function (window, $) {
    window.ytp = window.ytp || (function () {
            var version = '0.0.2';
            var elementId, sessionId, videoOptions, playerState, userLocation;
            var slides = [];
            var statsCollected = false;
            var seconds = [];
            var intervals = [];
            var apiReady = false;
            return {
                isApiReady: function () {
                    return apiReady;
                },
                setVideoOptions: function (options) {
                    videoOptions = options;
                },

                setId: function (id) {
                    elementId = id;
                },

                init: function () {
                    console.log("init player");
                    ytp.getLocation();
                    sessionId = ytp.makeSessionId();
                    window.onYouTubeIframeAPIReady = (function () {
                        return function () {
                            apiReady = true;
                            return ytp.initializeVideo();
                        };
                    })(this);
                    var tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = document.getElementsByTagName('script')[0];

                    //window.onbeforeunload = ytp.beforeUnload();
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    return this;
                },

                initializeVideo: function () {
                    this.player = new YT.Player(elementId, {
                        width: videoOptions.width,
                        height: videoOptions.height,
                        videoId: videoOptions.videoId,
                        playerVars: videoOptions.playerVars,
                        events: {
                            onReady: videoOptions.onReady,
                            onStateChange: function (e) {
                                ytp.onPlayerStateChange(e)
                            },
                            onPlaybackQualityChange: videoOptions.onPlaybackQualityChange,
                            onPlaybackRateChange: videoOptions.onPlaybackRateChange,
                            onApiChange: videoOptions.onApiChange,
                            onError: videoOptions.onError
                        }
                    });
                    console.log("player loaded");
                    return this;
                },
                onPlayerStateChange: function (e) {
                    playerState = e.data;
                    videoOptions.onStateChange(e);
                    switch (e.data) {
                        case 0:
                            typeof videoOptions.onEnd === "function" ? videoOptions.onEnd(e) : void 0;
                            break;
                        case 1:
                            typeof videoOptions.onPlay === "function" ? videoOptions.onPlay(e) : void 0;
                            if (!statsCollected) ytp.collectStats();
                            ytp.showSlides();
                            break;
                        case 2:
                            typeof videoOptions.onPause === "function" ? videoOptions.onPause(e) : void 0;
                            ytp.sendStats();
                            break;
                        case 3:
                            typeof videoOptions.onBuffer === "function" ? videoOptions.onBuffer(e) : void 0;
                            break;
                    }
                },
                play: function () {
                    this.player.playVideo();
                    return this;
                },
                pause: function () {
                    this.player.pauseVideo();
                    return this;
                },
                seekTo: function (time) {
                    this.player.seekTo(time);
                    return this;
                },
                volume: function (vol) {
                    this.player.setVolume(vol);
                    return this;
                },
                mute: function () {
                    this.player.mute();
                    return this;
                },
                getPlayer: function () {
                    return this.player;
                },
                version: function () {
                    return version;
                },
                addEventListener: function (event, listener) {
                    this.player.addEventListener(event, listener);
                    return this;
                },
                removeEventListener: function (event, listener) {
                    this.player.removeEventListener(event, listener);
                    return this;
                },
                collectStats: function () {
                    var currentTime = 0, currentSecond = 0;
                    statsCollected = true;
                    var self = this;
                    window.setInterval(function () {
                        if (playerState == 1) {
                            currentTime = self.player.getCurrentTime();
                            currentSecond = parseInt(currentTime.toFixed());
                            seconds.push(currentSecond);
                        }
                    }, 1000);
                },
                buildIntervals: function () {
                    intervals = [];
                    seconds = seconds.sort(function (a,b) {
                        return a - b;
                    });
                    var begin = seconds[0], end;
                    for (var i = 0; i < seconds.length; i++) {
                        if (seconds[i - 1] && seconds[i] - seconds[i - 1] > 1) {
                            end = seconds[i - 1];
                            intervals.push({
                                time_from: begin,
                                time_to: end
                            });
                            begin = seconds[i];
                        }
                    }
                    intervals.push({
                        time_from: begin,
                        time_to: seconds[seconds.length - 1]
                    });
                },
                showSlides: function () {
                    var currentTime;
                    var slideShow = [];

                    videoOptions.slides && videoOptions.slides.forEach(function (item, i) {
                        var from = item.from.split(':');
                        var to = item.to.split(':');
                        slides.push({
                            isVisible: false,
                            from: ((+from[0]) * 60 * 60 + (+from[1]) * 60 + (+from[2])),
                            to: (+to[0]) * 60 * 60 + (+to[1]) * 60 + (+to[2]),
                            content: item.content
                        });
                        var self = this;
                        slideShow[i] = window.setInterval(function () {
                            currentTime = self.player.getCurrentTime();
                            if (currentTime >= slides[i].from && currentTime <= slides[i].to) {

                                if (!slides[i].isVisible) {
                                    videoOptions.playerSidebar.html(slides[i].content);
                                    videoOptions.playerSidebar.removeClass('zoomOutUp').addClass('lightSpeedIn');
                                    slides[i].isVisible = true;
                                }
                            }
                            else {
                                if (slides[i].isVisible) {
                                    videoOptions.playerSidebar.removeClass('lightSpeedIn').addClass('zoomOutUp');
                                    slides[i].isVisible = false;
                                }
                            }
                        }, 1000);
                    })
                },
                makeSessionId: function () {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 5; i++)
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    return text;
                },
                getLocation: function () {
                    $.ajax({
                        url: 'https://freegeoip.net/json/',
                        type: 'POST',
                        dataType: 'jsonp',
                        success: function (location) {
                            userLocation = location && location.country_code;
                            console.log("User location " + userLocation);
                        },
                        error: function () {
                            userLocation = 'Unknown';
                        }
                    });
                },
                beforeUnload: function () {
                    var currentTime = this.player.getCurrentTime();
                    this.sendStats(currentTime);
                },
                sendStats: function () {
                    var url = 'http://nodejs-ytapi.rhcloud.com/'; //'http://127.0.0.1:8888/';

                    var nAgt = navigator.userAgent;
                    var browserName = navigator.appName;

                    ytp.buildIntervals();

                    if (nAgt.indexOf("Opera") != -1) {
                        browserName = "Opera";
                    }
                    else if (nAgt.indexOf("MSIE") != -1) {
                        browserName = "IE";
                    }
                    else if (nAgt.indexOf("Chrome") != -1) {
                        browserName = "Chrome";
                    }
                    else if (nAgt.indexOf("Safari") != -1) {
                        browserName = "Safari";
                    }
                    else if (nAgt.indexOf("Firefox") != -1) {
                        browserName = "Firefox";
                    }
                    var stats = {
                        intervals: intervals,
                        sessionId: sessionId,
                        videoId: videoOptions.videoId,
                        videoLength: this.player.getDuration().toFixed(),
                        browserName: browserName || 'Unknown',
                        location: userLocation,
                        ref: window.location.href
                    };
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: stats,
                        success: function () {
                            console.log(" DATA " + JSON.stringify(stats, null, 2) + " SENT!");
                        },
                        error: function () {
                            console.log("ERROR SENDING DATA!");
                        }
                    });
                },
                YTPlayer: function () {
                    var options = window.YTPlayerSettings || {};
                    options.id = 'YTPlayerContainer';
                    options.width = options.width || 640;
                    options.height = options.height || 480;
                    options.playerSidebar = options.sidebar && options.sidebar.css({
                            'height': options.height,
                            'width': options.width
                        });
                    options.videoId = options.videoId || 'OPf0YbXqDm0';
                    options.playerVars = options.playerVars || {};
                    options.slides = options.slides | {};
                    options.onStateChange = options.onStateChange || function () {};
                    options.onReady = options.onReady || function () {};
                    ytp.setVideoOptions(options);
                    ytp.setId(options.id);
                    if (ytp.isApiReady()) {
                        return ytp.initializeVideo();
                    } else {
                        return ytp.init();
                    }
                }
            }
        })();
})(window, window.jQuery);