var player = null;
var events = [];

function teardown() {
    $('#events li').removeClass('active');
    $('#events li .badge').html('0').css('background-color', '#777');
    events = [];
}
function injectPlayerTag(tag) {
    var container = $('#playerPlaceholder');
    container.empty();
    var eventsPos = tag.indexOf('playerVars') - 1;
    var handlers =
        ' onReady: function () {player = window.ytp; increaseEvent("onReady")},\n\
            onPlay: function () {increaseEvent("onPlay")},\n\
            onPause: function () {increaseEvent("onPause")},\n\
            onEnd: function () {increaseEvent("onEnd")},\n\
            onBuffer: function () {increaseEvent("onBuffer")},\n\
            onError: function () {increaseEvent("onError")},\n\
            onPlaybackQualityChange: function () {increaseEvent("onPlaybackQualityChange")},\n\
            onPlaybackRateChange: function () {increaseEvent("onPlaybackRateChange")},\n\
            onApiChange: function () {increaseEvent("onApiChange")},\n\
            onStateChange: function () {increaseEvent("onStateChange")},\n\
        ';
    tag = tag.slice(0, eventsPos) + handlers + tag.slice(eventsPos);
    container.append($(tag));
    //
    //$(container).YTPlayer({
    //    width: 800,
    //    //height: 560,
    //    videoId: 'OPf0YbXqDm0',
    //    sidebar: $('.player-sidebar'),
    //    slides: [
    //        {
    //            from: '00:00:03',
    //            to: '00:00:07',
    //            content: "<h2>This is a slide from 00:00:03 to 00:00:07!</h2>"
    //        },
    //        {
    //            from: '00:00:08',
    //            to: '00:00:15',
    //            content: "<h2>This is a slide from 00:00:08 to 00:00:15!</h2>"
    //        }
    //    ]
    //});
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
    injectPlayerTag(tag);
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
    $('#btnPlay').on('click touchstart', function () {
        player && player.play();
    });
    $('#btnPause').on('click touchstart', function () {
        player && player.pause();
    });
    $('#injectPlayerTag').on('click touchstart', function () {
        var tag = $('#txtPlayerTag').val();
        tag && loadPlayer(tag);
    });
    $('#btnSeek').on('click touchstart', function () {
        var seekTo = parseInt($('#txtSeek').val());
        player && player.seekTo(seekTo);
    });
    $('#btnVolume').on('click touchstart', function () {
        var volume = parseInt($('#txtVolume').val());
        player && player.volume(volume);
    });
    $('#btnMute').on('click touchstart', function () {
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
    $('#btnCopy').on('click touchstart', function() {
        $('#txtPlayerTag').select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    });
}

$(document).ready(function () {
    bindEvents();
    initAPIEventsList();
});