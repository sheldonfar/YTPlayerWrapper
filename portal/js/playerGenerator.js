$(document).ready(function () {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $('#generate-button').on('click touchstart', function () {
        var width = $('#playerWidth').val() || 640;
        var height = $('#playerHeight').val() || 360;
        var videoId = $('#videoId').val() || getParameterByName('id') || '09R8_2nJtjg';
        var autoplay = $('#autoplay').is(":checked");
        var subtitles = $('#subtitles').is(":checked");
        var annotations = $('#annotations').is(":checked")? 1 : 3;
        var info = $('#info').is(":checked");
        var related = $('#related').is(":checked");
        var hideLogo = $('#hidelogo').is(":checked");

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
        var playerTag = '<div id="YTPlayerContainer"><div class="ytplayer">\n<script>\n' + options + '\n</script>\n</div></div>\n<script src="http://sheldonfar.com/ytapi/player/delivery.js"></script>';

        $('#txtPlayerTag').text(playerTag);
    }).click();
    $('#injectPlayerTag').click();
});