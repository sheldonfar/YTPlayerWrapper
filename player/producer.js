if (!window.ytp || !window.jQuery) {
    function loadPlayer() {
        var playerScript = document.createElement('script');
        playerScript.type = 'text/javascript';
        playerScript.onload = function () {
            ytp.YTPlayer();
        };
        playerScript.src = 'https://rawgit.com/sheldonfar/YTPlayerWrapper/master/build/player.min.js'; //'http://sheldonfar.com/ytplayer/player.min.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(playerScript);
    }
    (function () {
        if (!window.jQuery) {
            var jqueryScript = document.createElement('script');
            jqueryScript.type = 'text/javascript';
            jqueryScript.onload = function () {
               loadPlayer();
            };
            jqueryScript.src = 'https://code.jquery.com/jquery-2.2.0.min.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(jqueryScript);
        } else {
            loadPlayer();
        }
    })();
} else {
    ytp.YTPlayer();
}