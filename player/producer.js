if(!window.ytp) {
    (function(){
        if (!window.jQuery) {
            var jqueryScript = document.createElement('script');
            jqueryScript.type = 'text/javascript';
            jqueryScript.src = 'https://code.jquery.com/jquery-2.2.0.min.js';
            (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(jqueryScript);
        }

        var playerScript = document.createElement('script');
        playerScript.type = 'text/javascript';
        playerScript.onload = function() {
            ytp.YTPlayer();
        };
        playerScript.src = 'http://sheldonfar.com/ytplayer/player.min.js';
        (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(playerScript);
    })();
} else {
    ytp.YTPlayer();
}