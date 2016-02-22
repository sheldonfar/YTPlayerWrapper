(function (window, $) {
    window.ytp = window.ytp || (function () {
            var version = '0.0.1';
            var elementId, sessionId, videoOptions, player, playerState, userLocation;
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
                    player = new YT.Player(elementId, {
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
                            ytp.buildIntervals();
                            ytp.sendStats();
                            break;
                        case 3:
                            typeof videoOptions.onBuffer === "function" ? videoOptions.onBuffer(e) : void 0;
                            break;
                    }
                },
                play: function () {
                    player.playVideo();
                    return this;
                },
                pause: function () {
                    player.pauseVideo();
                    return this;
                },
                seekTo: function (time) {
                    player.seekTo(time);
                    return this;
                },
                volume: function (vol) {
                    player.setVolume(vol);
                    return this;
                },
                mute: function () {
                    player.mute();
                    return this;
                },
                getPlayer: function () {
                    return player;
                },
                version: function () {
                    return version;
                },
                addEventListener: function (event, listener) {
                    console.log("player " + player);
                    player.addEventListener(event, listener);
                    return this;
                },
                removeEventListener: function (event, listener) {
                    player.removeEventListener(event, listener);
                    return this;
                },
                collectStats: function () {
                    var currentTime = 0;
                    var currentSecond = 0;
                    var checkFragments = [];

                    statsCollected = true;

                    window.setInterval(function () {
                        currentTime = player.getCurrentTime();
                        if (playerState == 1) {
                            currentSecond = currentTime.toFixed();
                            seconds.push(currentSecond);
                            //$('body').append('<br>Second:' + currentSecond + " watched");
                        }
                    }, 1000);
                },
                buildIntervals: function () {
                    intervals = [];
                    var begin = seconds[0];
                    var end;
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
                    intervals.forEach(function (item) {
                        $('body').append('Interval: ' + item.time_from + ":" + item.time_to + '<br>');
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
                        slideShow[i] = window.setInterval(function () {
                            currentTime = player.getCurrentTime();
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
                        url: '//freegeoip.net/json/',
                        type: 'POST',
                        dataType: 'jsonp',
                        success: function (location) {
                            userLocation = location.country_code;
                        }
                    });
                },
                beforeUnload: function () {
                    var currentTime = player.getCurrentTime();
                    this.sendStats(currentTime);
                },
                sendStats: function () {
                    var url = 'http://127.0.0.1:8888/';//'http://nodejs-ytapi.rhcloud.com/';

                    var nAgt = navigator.userAgent;
                    var browserName = navigator.appName;
                    var nameOffset, verOffset;

                    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
                        browserName = "Opera";
                    }
                    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
                        browserName = "IE";
                    }
                    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                        browserName = "Chrome";
                    }
                    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
                        browserName = "Safari";
                    }
                    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                        browserName = "Firefox";
                    }
                    var stats = {
                        intervals: intervals,
                        sessionId: sessionId,
                        videoId: videoOptions.videoId,
                        videoLength: player.getDuration().toFixed(),
                        browserName: browserName,
                        location: userLocation,
                        ref: window.location.href
                    };
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: stats,
                        success: function () {
                            console.log(" DATA " + JSON.stringify(stats, null, 4) + " SENT!");
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