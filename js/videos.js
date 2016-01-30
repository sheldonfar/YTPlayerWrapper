$(function (){
    $('button.searchVideo').click(function() {
        var videoURL = 'http://nodejs-ytapi.rhcloud.com/api/videos';
        var video_id = $.trim($('#videoIdInput').val());
        var apiKey = 'AIzaSyAh0r3GAU-hX6w62oLc2vrXGKyzelQQMhc';
        $.ajax({
            type: 'GET',
            url: videoURL,
            data: {videoId: video_id},
            success: function(responseData) {
                if(responseData.length > 0) {
                    var tableBody = $('#table-sessions').find('tbody');
                    var tableRow;
                    $.each(responseData, function(i, item) {
                        tableRow = '';
                        $('span.video-id').html(video_id);
                        $('div.embed-responsive').html('<iframe class="embed-responsive-item" src="//www.youtube.com/embed/' + item.video_id + '"></iframe>');

                        tableRow += '<tr><td>' + item.session_id + '</td>';
                        var time_from = item.all_time_from.split(',');
                        var time_to = item.all_time_to.split(',');
                        tableRow += '<td>';
                        for(var j = 0; j < time_from.length; j++) {
                            tableRow += time_from[j] + ' - ';
                            tableRow += time_to[j];
                            j < time_from.length - 1? tableRow += ', ' : null;
                        }
                        tableRow += '</td></tr>';
                        tableBody.append(tableRow);
                    });
                    $('#table-sessions').DataTable({
                        "bLengthChange": false
                    });
                    $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=" + video_id + "&key=" + apiKey, function(ytData) {
                        var date = new Date(ytData.items[0].snippet.publishedAt);

                        $('span.video-title').append(ytData.items[0].snippet.title);
                        $('span.video-publishedat').append(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear());
                        $('span.video-description').append(ytData.items[0].snippet.description.substr(0,110));
                        $('span.video-duration').append(ytData.items[0].contentDetails.duration);
                        $('span.video-viewcount').append(ytData.items[0].statistics.viewCount);
                        $('span.video-likecount').append(ytData.items[0].statistics.likeCount);
                        $('span.video-dislikecount').append(ytData.items[0].statistics.dislikeCount);
                        $('span.video-favoritecount').append(ytData.items[0].statistics.favoriteCount);
                        $('span.video-commentcount').append(ytData.items[0].statistics.commentCount);
                    });
                    $(".video-row").toggleClass('hidden');
                } else {
                    alert("An error occured processing your request");
                }


            }
        });

    });
});