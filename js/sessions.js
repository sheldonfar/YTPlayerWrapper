$(function () {
    var sessionURL = 'http://nodejs-ytapi.rhcloud.com/api/sessions';


    $.ajax({
        type: 'GET',
        url: sessionURL,
        success: function (responseData) {
            var tableBody = $('#sessions-table').find('tbody');
            $.each(responseData, function (i, item) {
                var tableRow = '';
                tableRow += '<tr><td>' + item.session_id + '</td><td>' + item.video_id + '</td><td>' + item.time_added + '</td><td>' + item.time_watched + '</td>';
                var time_from = item.all_time_from.split(',');
                var time_to = item.all_time_to.split(',');
                tableRow += '<td>';
                for (var j = 0; j < time_from.length; j++) {
                    tableRow += time_from[j] + ' - ';
                    tableRow += time_to[j];
                    j < time_from.length - 1 ? tableRow += ', ' : null;
                }
                tableRow += '</td></tr>';
                tableBody.append(tableRow);
            });
            $('#sessions-table').DataTable({
                "bLengthChange": false
            });
        }
    });

    $('button.searchSession').click(function () {

        var session = $.trim($('#sessionIdInput').val());
        var apiKey = 'AIzaSyAh0r3GAU-hX6w62oLc2vrXGKyzelQQMhc';
        var video_id;
        var watched_percentage;
        var time_watched = 0;
        $.ajax({
            type: 'GET',
            url: sessionURL,
            data: {sessionId: session},
            success: function (responseData) {
                if (responseData.length > 0) {
                    console.log(responseData);
                    $.each(responseData, function (i, item) {
                        $('span.session-id').html(item.session_id);
                        $('div.embed-responsive').html('<iframe class="embed-responsive-item" src="//www.youtube.com/embed/' + item.video_id + '"></iframe>');
                        video_id = item.video_id;

                        if (i + 1 == responseData.length) {
                            watched_percentage = Math.round(item.time_watched / item.time_total * 100);
                        }
                    });
                    $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=" + video_id + "&key=" + apiKey, function (ytData) {
                        var date = new Date(ytData.items[0].snippet.publishedAt);

                        $('span.video-title').append(ytData.items[0].snippet.title);
                        $('span.video-publishedat').append(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear());
                        $('span.video-description').append(ytData.items[0].snippet.description.substr(0, 110));
                        $('span.video-duration').append(ytData.items[0].contentDetails.duration);
                        $('span.video-viewcount').append(ytData.items[0].statistics.viewCount);
                        $('span.video-likecount').append(ytData.items[0].statistics.likeCount);
                        $('span.video-dislikecount').append(ytData.items[0].statistics.dislikeCount);
                        $('span.video-favoritecount').append(ytData.items[0].statistics.favoriteCount);
                        $('span.video-commentcount').append(ytData.items[0].statistics.commentCount);
                    });
                    $(".video-row").toggleClass('hidden');

                    Morris.Donut({
                        element: 'pie-chart',
                        data: [
                            {label: "Watched Time, %", value: watched_percentage},
                            {label: "Unwatched Time, %", value: 100 - watched_percentage}
                        ]
                    });
                } else {
                    alert("An error occured processing you request");
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });

    });
});