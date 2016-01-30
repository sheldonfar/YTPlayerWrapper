var player = null;
var events = [];

function updateVideoInfo(event) {
    var data = event && event.data || {};
    $('.videoId').html(data.videoId);
    $('.videoTitle').html(data.title);
    $('.videoDuration').html(Math.round(data.duration));
    $('.videoStudio').html(data.studio);
    $('.videoCategory').html(data.category);
    $('.videoKeywords').html(data.keywords);
}

function teardown() {
    $('#events li').removeClass('active');
    $('#events li .badge').html('0');
    events = [];
}

function injectPlayerTag(tag, cb) {
    var container = $('#playerContainer');
    container.empty();
    container.append($(tag));

    $(container).YTPlayer({
        width: 800,
        //height: 560,
        videoId: 'OPf0YbXqDm0',
        onReady: function () {
            increaseEvent('onReady')
        },
        onPlay: function () {
            increaseEvent('onPlay')
        },
        onPause: function () {
            increaseEvent('onPause')
        },
        onEnd: function () {
            increaseEvent('onEnd')
        },
        onBuffer: function () {
            increaseEvent('onBuffer')
        },
        onError: function () {
            increaseEvent('onError')
        },
        onPlaybackQualityChange: function () {
            increaseEvent('onPlaybackQualityChange')
        },
        onPlaybackRateChange: function () {
            increaseEvent('onPlaybackRateChange')
        },
        onApiChange: function () {
            increaseEvent('onApiChange')
        },
        onStateChange: function () {
            increaseEvent('onStateChange')
        },
        sidebar: $('.player-sidebar'),
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
    player = window.ytp;
    cb();
}

function updatePlayerVersion() {
    $('.playerVersion').text(player.version());
}

var API_EVENTS;

function initAPIEventsList() {
    if ($('#lsApiEvents > li').length == 0) {
        var list = $('#lsApiEvents');
        list.empty();

        API_EVENTS = [
            'onReady',
            'onPlay',
            'onPause',
            'onEnd',
            'onBuffer',
            'onError',
            'onStateChange',
            'onPlaybackQualityChange',
            'onPlaybackRateChange',
            'onApiChange'

        ];
        for (var i = 0; i < API_EVENTS.length; i++) {
            var item = $("<li id='api_event_" + API_EVENTS[i] + "' class='list-group-item'>" + API_EVENTS[i] + ": <span class='badge'>0</span></li>");
            list.append(item);
        }
    }
}

function loadPlayer(tag) {
    teardown();
    injectPlayerTag(tag, function () {
        updatePlayerVersion();
    });
}

function increaseEvent(eventName) {
    if (typeof events[eventName] === 'undefined') {
        events[eventName] = 0;
    }
    events[eventName]++;
    $('#api_event_' + eventName + ' span').html(events[eventName]).css('background-color', '#fff');
    $('#api_event_' + eventName).addClass('active');
    setTimeout(function () {
        $('#api_event_' + eventName).removeClass('active');
        $('#api_event_' + eventName + ' span').css('background-color', '#337ab7');
    }, 2000);
}

function bindEvents() {
    $('#btnPlay').click(function () {
        player && player.play();
    });
    $('#btnPause').click(function () {
        player && player.pause();
    });
    $('#injectPlayerTag').click(function () {
        var tag = $('#txtPlayerTag').val();
        tag && loadPlayer(tag);
    });
    $('#btnSeek').click(function () {
        var seekTo = parseInt($('#txtSeek').val());
        player && player.seekTo(seekTo);
    });
    $('#btnVolume').click(function () {
        var volume = parseInt($('#txtVolume').val());
        player && player.volume(volume);
    });
    $('#btnMute').click(function () {
        player && player.mute();
        if (player.getPlayer().isMuted()) {
            $(this).html().replace("Unmute", "Mute");
            $(this).find('span').removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
            player.getPlayer().unMute();
        } else {
            $(this).html().replace("Mute", "Unmute");
            $(this).find('span').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
            player.getPlayer().mute();
        }
    });
}

function setPlayerTagArea() {
    $('#txtPlayerTag').text('<div class="ytplayer"><script src="player.js"></script></div>')
}
$(document).ready(function () {
    bindEvents();
    initAPIEventsList();
    setPlayerTagArea();
});