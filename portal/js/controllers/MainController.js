(function () {
    var serverUrl = 'http://nodejs-ytapi.rhcloud.com/api/';// 'http://127.0.0.1:8888/api/';

    angular.module('portal.main', ['ngRoute', 'portal.video', 'googlechart'])
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
                serverUrl: serverUrl,
                countsUrl: serverUrl + 'counts',
                browsersUrl: serverUrl + 'browsers',
                videosUrl: serverUrl + 'videos',
                specificVideoUrl: serverUrl + 'videos/'
            }
        })
        .controller('MainController', ["config", "$scope", "$http", function (config, $scope, $http) {
            $http({method: 'GET', url: config.serverUrls.countsUrl}).success(function (data) {
                $scope.sessions = {count: data[0].session_count};
                $scope.videos = {count: data[0].video_count};
                $scope.time_watched = {count: data[0].time_watched};
                $scope.watched_percentage = {count: (data[0].time_watched / data[0].total_time * 100).toFixed(2)};
            }).error(function () {
                console.log("No connection");
            });

            $http({method: 'GET', url: config.serverUrls.videosUrl}).success(function (data) {
                //TODO: Limit to top5 by views
                $scope.topVideos = data;
                $scope.topVideosLoaded = true;
            }).error(function () {
                console.log("No connection");
            });
        }])
        .controller("ChartController", ["config", "$http", "$scope", function (config, $http, $scope) {
            $scope.buildChart = function (data, type, options, name) {
                $scope[name + '_chart'] = {
                    type: type,
                    data: data,
                    options: options
                };
            };

            drawBarChart('views');
            drawBarChart('seconds');
            drawLocChart('country');
            drawLocChart('ref');
            drawBrowsersCharts();

            function drawBarChart(name) {
                $http({
                    method: 'GET',
                    url: config.serverUrls.serverUrl + 'videos/lastweek'
                }).success(function (response) {
                    var data = {
                        cols: [
                            {id: 'd', label: 'Date', type: 'date'},
                            {id: 'n', label: name, type: 'number'}
                        ],
                        rows: []
                    }, dateAdded;
                    for (var i = 0; i < 7; i++) {
                        var minusOneDay = new Date();
                        minusOneDay.setDate(minusOneDay.getDate() - (i + 1));
                        dateAdded = false;
                        response.forEach(function (row) {
                            var watchedDate = new Date(row.date);
                            if (minusOneDay.toDateString() === watchedDate.toDateString()) {
                                data.rows.push({c: [{v: minusOneDay},{v: row[name]}]});
                                dateAdded = true;
                            }
                        });
                        if (!dateAdded) {
                            data.rows.push({c: [{v: minusOneDay},{v: 0}]});
                        }
                    }

                    var options = {
                        title: 'Views last week',
                        height: 350
                    };
                    $scope.buildChart(data, 'BarChart', options, name);
                });
            }

            function drawLocChart(type) {
                var chartType;
                if (type == 'country') chartType = 'Geo';
                if (type == 'ref') chartType = 'Pie';
                $http({
                    method: 'GET',
                    url: config.serverUrls.serverUrl + 'locations/' + type
                }).success(function (response) {
                    var geoData = [];
                    if (chartType == 'Geo') geoData.push(['Countries', 'Views']);
                    if (chartType == 'Pie') geoData.push(['Sites', 'Views']);
                    response.forEach(function (row) {
                        geoData.push([row.country || row.ref, row.total])
                    });
                    var options = {
                        title: geoData[0][0],
                        height: 350
                    };
                    $scope.buildChart(geoData, chartType + 'Chart', options, type);
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
                        colors = $.grep(colors, function (value) {
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