(function () {

    angular.module('portal.main', ['ngRoute', 'portal.video'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'main.html',
                controller: 'MainController'
            });
        }])
        .constant('config', {
            appName: 'YouTube Wrapper Portal',
            appVersion: '0.0.1',
            serverUrls: {
                serverUrl: 'http://nodejs-ytapi.rhcloud.com/api/',
                countsUrl: 'http://nodejs-ytapi.rhcloud.com/api/counts',
                browsersUrl: 'http://nodejs-ytapi.rhcloud.com/api/browsers',
                videosUrl: 'http://nodejs-ytapi.rhcloud.com/api/videos',
                specificVideoUrl: 'http://nodejs-ytapi.rhcloud.com/api/videos/video'
            }
        })
        .controller('MainController', ["config", "$scope", "$http", function (config, $scope, $http) {
            $http({method: 'GET', url: config.serverUrls.countsUrl}).success(function (data) {
                $scope.sessions = {count: data[0].session_count};
                $scope.videos = {count: data[0].video_count};
                $scope.time_watched = {count: data[0].time_watched};
                $scope.watched_percentage = {count: (data[0].time_watched / data[0].total_time * 100).toFixed(2)};
            });
        }])
        .controller('ChartController', ["config", "$scope", "$http", function (config, $scope, $http) {
            google.load('visualization', '1.1', {'packages': ['bar', 'corechart'], 'callback': drawCharts});

            function drawCharts() {
                drawBarChart('views');
                drawBarChart('seconds');
                drawLocChart('geo');
                drawLocChart('pie');
                drawBrowsersCharts();
            }

            function drawBarChart(type) {
                $http({
                    method: 'GET',
                    url: config.serverUrls.serverUrl + 'videos/lastweek'
                }).success(function (response) {
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'Date');
                    data.addColumn('number', type);
                    var dateAdded;
                    for (var i = 0; i < 7; i++) {
                        var minusOneDay = new Date();
                        minusOneDay.setDate(minusOneDay.getDate() - (i + 1));
                        dateAdded = false;
                        response.forEach(function (row) {
                            var watchedDate = new Date(row.date);
                            if (minusOneDay.toDateString() === watchedDate.toDateString()) {
                                data.addRow([minusOneDay, row[type]]);
                                dateAdded = true;
                            }
                        });
                        if (!dateAdded) {
                            data.addRow([minusOneDay, 0]);
                        }
                    }
                    var options = google.charts.Bar.convertOptions({
                        title: 'Views last week',
                        height: 350
                    });
                    var chart = new google.charts.Bar(document.getElementById(type + '-chart'));
                    chart.draw(data, options);
                });
            }

            function drawLocChart(type) {
                var url;
                if (type == 'geo') url = 'country';
                if (type == 'pie') url = 'ref';
                $http({
                    method: 'GET',
                    url: config.serverUrls.serverUrl + 'locations/' + url
                }).success(function (response) {
                    var geoData = [];
                    if (type == 'geo') geoData.push(['Countries', 'Views']);
                    if (type == 'pie') geoData.push(['Sites', 'Views']);
                    response.forEach(function (row) {
                        geoData.push([row.country || row.ref, row.total])
                    });
                    var data = google.visualization.arrayToDataTable(geoData);
                    var options = {
                        title: geoData[0][0],
                        height: 350
                    };
                    var chart;
                    if (type == 'geo') chart = new google.visualization.GeoChart(document.getElementById('geo-chart'));
                    if (type == 'pie') chart = new google.visualization.PieChart(document.getElementById('ref-chart'));
                    chart.draw(data, options);
                });
            }

            function drawBrowsersCharts() {
                $http({
                    method: 'GET',
                    url: config.serverUrls.browsersUrl
                }).success(function (data) {
                    var total = 0;
                    for (var j = 0; j < data.length; j++) {
                        total += data[j].counts;
                    }
                    $.each(data, function (i, item) {
                        if (item && item.name) {
                            var percents = (item.counts * 100 / total).toFixed(2) - 0;
                            var pieChart = $('.' + item.name.toLowerCase() + '-chart');
                            pieChart.attr("data-percent", percents);
                            $('.' + item.name.toLowerCase() + '-chart span').text(percents);
                        }
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
                });
            }
        }]);
})();