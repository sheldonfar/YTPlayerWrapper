(function () {

    angular.module('portal.create', ['ngRoute', 'portal.main'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/create', {
                templateUrl: 'create.html',
                controller: 'CreatePlayerController'
            });
        }])

        .controller('CreatePlayerController', ["config", "$scope", function (config, $scope) {
            $scope.player = null;
            $scope.events = [];

            $scope.play = function () {
                player && player.play();
            };

            $scope.pause = function () {
                player && player.pause();
            };

            $scope.seekTo = function (seekTo) {
                player && player.seekTo(seekTo);
            };

            $scope.setVolume = function (volume) {
                player && player.volume(volume);
            };

            $scope.mute = function () {
                player && player.mute();
                if (player.getPlayer().isMuted()) {
                    $scope.muteText = 'Mute';
                    $(this).find('span').removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
                    player.getPlayer().unMute();
                } else {
                    $scope.muteText = 'Unmute';
                    $(this).find('span').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
                    player.getPlayer().mute();
                }
            };

            $scope.createPlayer = function () {
                var width = $scope.width || 540;
                var height = $scope.height || 360;
                var videoId = ($scope.videoId && getVideoId($scope.videoId)) || getParameterByName('id') || '09R8_2nJtjg';
                var autoplay = $scope.autoplay || false;
                var subtitles = $scope.subtitles || false;
                var annotations = $scope.annotations ? 1 : 3;
                var info = $scope.info || false;
                var related = $scope.related || false;
                var hideLogo = $scope.hidelogo || false;

                var options = 'window.YTPlayerSettings = {\n\
                    width: ' + width + ',\n\
                    height: ' + height + ',\n\
                    videoId: "' + videoId + '",\n\
                    playerVars: {\n\
                    autoplay: ' + +autoplay + ',\n\
                    cc_load_policy: ' + +subtitles + ',\n\
                    iv_load_policy: ' + +annotations + ',\n\
                    rel: ' + +related + ',\n\
                    modestbranding: ' + +hideLogo + ',\n\
                    showinfo: ' + +info + '\n\
                    }\n\
                    };';
                $scope.playerTag = '<div id="YTPlayerContainer"><div class="ytplayer">\n<script type="text/javascript">\n' + options + '\n</script>\n</div></div>\n<script src="https://rawgit.com/sheldonfar/YTPlayerWrapper/master/build/producer.min.js"></script>';
            };

            $scope.injectPlayerTag = function () {
                $scope.playerTag && this.loadPlayer();
            };

            $scope.copyPlayerTag = function () {
                $('#txtPlayerTag').select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    alert('Looks like your browser does not support copying this way. Try copying manually');
                }
            };

            $scope.increaseEvent = function (eventName) {
                if (typeof $scope.events[eventName] === 'undefined') {
                    $scope.events[eventName] = 0;
                }
                $scope.events[eventName]++;
                $('#api_event_' + eventName + ' span').html($scope.events[eventName]).css('background-color', '#fff');
                $('#api_event_' + eventName).addClass('active');
                setTimeout(function () {
                    $('#api_event_' + eventName).removeClass('active');
                    $('#api_event_' + eventName + ' span').css('background-color', '#337ab7');
                }, 2000);
            };

            $scope.loadPlayer = function () {
                this.teardown();
                var tag = $scope.playerTag;
                var container = $('#playerPlaceholder');
                container.empty();
                var eventsPos = tag.indexOf('playerVars') - 1;
                var handlers =
                    ' onReady: function () {player = window.ytp; angular.element(document.getElementById("create-controller")).scope().increaseEvent("onReady")},\n\
                        onPlay: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onPlay")},\n\
                        onPause: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onPause")},\n\
                        onEnd: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onEnd")},\n\
                        onBuffer: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onBuffer")},\n\
                        onError: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onError")},\n\
                        onPlaybackQualityChange: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onPlaybackQualityChange")},\n\
                        onPlaybackRateChange: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onPlaybackRateChange")},\n\
                        onApiChange: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onApiChange")},\n\
                        onStateChange: function () {angular.element(document.getElementById("create-controller")).scope().increaseEvent("onStateChange")},\n\
                    ';
                tag = tag.slice(0, eventsPos) + handlers + tag.slice(eventsPos);
                container.append($(tag));
                $scope.initAPIEventsList();
            };

            $scope.teardown = function () {
                $('#events li').removeClass('active');
                $('#events li .badge').html('0').css('background-color', '#777');
                $scope.events = [];
            };

            $scope.initAPIEventsList = function () {
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
            };
        }])
})();