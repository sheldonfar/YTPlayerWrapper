if(!window.ytp) {
    var tag = document.createElement('script');
    tag.src = "player.js";
    var lastScriptTag = document.getElementsByTagName('head')[0].lastChild;
    lastScriptTag.parentNode.insertBefore(tag, lastScriptTag);
}