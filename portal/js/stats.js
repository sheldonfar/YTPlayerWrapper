$(function () {
    function convertDate(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        date = dd + '-' + mm + '-' + yyyy;
        return date;
    }

    var morris_data = [];
    var statsURL = 'http://nodejs-ytapi.rhcloud.com/api';
    var viewCountURL = 'http://nodejs-ytapi.rhcloud.com/api/videos/views';
    var browsersURL = 'http://nodejs-ytapi.rhcloud.com/api/browsers';

    var today = new Date();
    morris_data.push({
        date: convertDate(today)
    });
    var minusOneDay;
    for (var i = 0; i < 7; i++) {
        minusOneDay = new Date(today);
        minusOneDay.setDate(today.getDate() - (i + 1));
        morris_data.push({
            date: convertDate(minusOneDay)
        });
    }
    $.ajax({
        type: 'GET',
        url: statsURL,
        data: {multipleLines: false},
        success: function (data) {
            $.each(data, function (i, item) {
                morris_data.forEach(function (morris) {
                    if (morris.date == item.date_added) {
                        morris.time_total = item.time_total;
                        morris.time_watched = item.time_watched;
                        morris.session_id = item.session_id;
                    }
                    else {
                        morris.time_total = 0;
                        morris.time_watched = 0;
                        morris.session_id = item.session_id;
                    }
                });
                $('.table-stats thead').after("<tr><td>" + item.session_id + "</td><td>" + item.video_id + "</td><td>" + item.time_from + "</td><td>" + item.time_to + "</td></tr>");
            });
            var first_chart_config = {
                data: morris_data,
                xkey: 'date',
                ykeys: ['time_watched'],
                labels: ['Watched Seconds'],
                fillOpacity: 0.6,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors: ['#ffffff'],
                pointStrokeColors: ['black'],
                lineColors: ['gray', 'red']
            };
            first_chart_config.element = 'line-chart';
            Morris.Line(first_chart_config);
        }
    });
    var viewData = [];
    $.ajax({
        type: 'GET',
        url: viewCountURL,
        success: function (data) {
            $.each(data, function (i, item) {
                viewData.push({
                    video_id: item.video_id,
                    view_count: item.views_count
                });
            });
            var second_chart_config = {
                data: viewData,
                xkey: 'video_id',
                ykeys: ['view_count'],
                labels: ['Video ID', 'View Count'],
                fillOpacity: 0.6,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors: ['#ffffff'],
                pointStrokeColors: ['black'],
                lineColors: ['gray', 'red']
            };
            second_chart_config.element = 'bar-chart';
            Morris.Bar(second_chart_config);
        }
    });

    $.ajax({
        type: 'GET',
        url: browsersURL,
        success: function (data) {
            $.each(data, function (i, item) {
                var percents = (item.count * 100 / item.total).toFixed(2) - 0;
                $('.' + item.name.toLowerCase() + '-chart').attr("data-percent", percents);
                $('.' + item.name.toLowerCase() + '-chart span').text(percents);
            });
            var colors = ['#F75554', '#F9CB7B', '#8BCFEB', '#95D171'];
            $('.chart').each(function () {
                var color = colors[Math.floor(Math.random() * colors.length)];
                colors = jQuery.grep(colors, function (value) {
                    return value != color;
                });
                $(this).easyPieChart({
                    trackColor: '#EFEFEF',
                    barColor: color
                })
            })
        }
    });
});