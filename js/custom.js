(function (window, $) {
    var ytp = (function () {
        var id;
        var options;
        var player;

        var fragments = [];
        var slides = [];
        return {
            init: function (id1, options1) {
                id = id1;
                options = options1;
                window.onYouTubeIframeAPIReady = (function () {
                    return function () {
                        return ytp.initializeVideo();
                    };
                })(this);
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                return firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            },
            initializeVideo: function () {
                player = new YT.Player(id, {
                    width: options.width,
                    height: options.height,
                    videoId: options.videoId,
                    playerVars: options.playerVars,
                    events: {
                        onReady: options.onReady,
                        onStateChange: function (e) {
                            ytp.onPlayerStateChange(e)
                        },
                        onPlaybackQualityChange: options.onPlaybackQualityChange,
                        onPlaybackRateChange: options.onPlaybackRateChange,
                        onApiChange: options.onApiChange,
                        onError: options.onError
                    }
                });

            },
            onPlayerStateChange: function (e) {
                switch (e.data) {
                    case 0:
                        typeof options.onEnd === "function" ? options.onEnd(e) : void 0;
                        break;
                    case 1:
                        typeof options.onPlay === "function" ? options.onPlay(e) : void 0;
                        ytp.collectStats();
                        ytp.showSlides();
                        break;
                    case 2:
                        typeof options.onPause === "function" ? options.onPause(e) : void 0;
                        break;

                    case 3:
                        typeof options.onBuffer === "function" ? options.onBuffer(e) : void 0;
                        break;
                }
            },
            collectStats: function () {
                var secondsWatched = [];
                var currentTime = 0;
                var fragmentWatched = false;
                var checkFragments = [];

                options.fragments.forEach(function (item, i, fragment) {
                    var from = item.from.split(':');
                    var to = item.to.split(':');
                    fragments.push({
                        isWatched: false,
                        from: ((+from[0]) * 60 * 60 + (+from[1]) * 60 + (+from[2])),
                        to: (+to[0]) * 60 * 60 + (+to[1]) * 60 + (+to[2]),
                        content: item.content
                    });
                    secondsWatched[i] = 0;

                    checkFragments[i] = window.setInterval(function () {

                        currentTime = player.getCurrentTime();
                        if (currentTime >= fragments[i].from && currentTime <= fragments[i].to) ++secondsWatched[i];
                        if (secondsWatched[i] === (fragments[i].to - fragments[i].from)) {
                            $('body').append('<br>Fragment:' + fragments[i].from + ":" + fragments[i].to + " watched!");
                            fragments[i].isWatched = true;
                            clearInterval(checkFragments[i]);
                        }
                    }, 1000);
                });
            },
            showSlides: function () {
                var currentTime;
                var slideShow = [];

                options.slides.forEach(function (item, i, fragment) {
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
                                options.playerSidebar.html(slides[i].content);
                                options.playerSidebar.fadeIn();
                                slides[i].isVisible = true;
                            }
                        }
                        else {
                            if (slides[i].isVisible) {
                                options.playerSidebar.fadeOut();
                                slides[i].isVisible = false;
                            }
                        }
                    }, 1000);
                })
            }
        }
    }());
    $.prototype.YTPlayer = function (options) {
        this.id = $(this).attr('id');
        this.playerDiv = $(this);
        this.width = options.width || 640;
        this.height = options.height || 480;
        this.playerSidebar = options.sidebar.css({
            'height': this.height,
            'width': this.width
        });
        this.videoId = options.videoId || 'OPf0YbXqDm0';
        this.playerVars = options.playerVars;
        this.fragments = options.fragments;
        this.slides = options.slides;
        this.onReady = options.onReady, this.onStateChange = options.onStateChange, this.onStart = options.onStart, this.onEnd = options.onEnd, this.onPlay = options.onPlay, this.onPause = options.onPause, this.onBuffer = options.onBuffer, this.onPlaybackQualityChange = options.onPlaybackQualityChange, this.onPlaybackRateChange = options.onPlaybackRateChange, this.onError = options.onError, this.onApiChange = options.onApiChange;

        return ytp.init(this.id, this);
    };

})(window, window.jQuery);