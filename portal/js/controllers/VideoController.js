(function () {

    angular.module('portal.video', ['ngRoute', 'ngNotify', 'portal.main', 'googlechart'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/videos', {
                templateUrl: 'videos.html',
                controller: 'VideoController'
            });
        }])
        .controller('VideoController', ["config", "$scope", "$http", "$sce", "ngNotify", function (config, $scope, $http, $sce, ngNotify) {
            var apiKey = 'AIzaSyAh0r3GAU-hX6w62oLc2vrXGKyzelQQMhc';

            $http({method: 'GET', url: config.serverUrls.videosUrl}).success(function (data) {
                $scope.videos = data;
                $('#videos-table').DataTable({
                    retrieve: true,
                    "bLengthChange": false
                });
            });

            var id = getParameterByName('id');
            if (id) {
                $scope.id = id;
                $scope.getVideoData(id);
            }

            ngNotify.config({
                theme: 'pure',
                position: 'top',
                button: true,
                duration: 3000
            });

            $scope.getVideoData = function (id) {
                if (!id) {
                    ngNotify.set('Video id is empty!', 'warn');
                }
                id = getVideoId(id);
                $scope.searchVideo = {videoId: id, loaded: false};
                $http({
                    method: 'GET',
                    url: config.serverUrls.specificVideoUrl + id
                }).success(function (data) {
                    if (data.length > 0) {
                        $scope.searchVideo.embedCode = $sce.trustAsHtml('<iframe class="embed-responsive-item" src="//www.youtube.com/embed/' + id + '"></iframe>');
                        $scope.searchVideo.sessions = [];
                        $scope.searchVideo.data = data;
                        $scope.loadYouTubePlayer();
                        $scope.buildImpressionChart(data);
                    } else {
                        $scope.videoNotFound = true;
                        ngNotify.set('Video not found. Maybe <a href="#create?id=' + id + '">Create a player from it</a> instead?', {
                            html: true,
                            type: 'error'
                        });
                    }
                });
            };

            $scope.loadYouTubePlayer = function () {
                $http({
                    method: 'GET',
                    url: "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=" + $scope.searchVideo.videoId + "&key=" + apiKey
                }).success(function (ytData) {
                    console.log(JSON.stringify(ytData,null,2));
                    var date = new Date(ytData.items[0].snippet.publishedAt);
                    $scope.searchVideo.title = ytData.items[0].snippet.title;
                    $scope.searchVideo.publishedAt = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                    $scope.searchVideo.description = ytData.items[0].snippet.description.substr(0, 110);
                    $scope.searchVideo.duration = ytData.items[0].contentDetails.duration;
                    $scope.searchVideo.viewCount = ytData.items[0].statistics.viewCount;
                    $scope.searchVideo.likeCount = ytData.items[0].statistics.likeCount;
                    $scope.searchVideo.dislikeCount = ytData.items[0].statistics.dislikeCount;
                    $scope.searchVideo.favoriteCount = ytData.items[0].statistics.favoriteCount;
                    $scope.searchVideo.commentCount = ytData.items[0].statistics.commentCount;
                }).error(function () {
                });
                $scope.searchVideo.loaded = true;
                ngNotify.set('Video found! :)', 'success');
            };

            $scope.buildImpressionChart = function (data) {
                var chartData = {
                    cols: [
                        {id: 'd', label: 'Second', type: 'number'},
                        {id: 'n', label: 'Impressions', type: 'number'}
                    ],
                    rows: []
                };
                var newData = [];
                $.each(data, function (index, item) {
                    var intervals = item.intervals.split(',');
                    intervals.forEach(function (interval) {
                        var seconds = [];
                        if (interval.indexOf('-') > -1) {
                            var splitted = interval.split('-');
                            if (+splitted[1] < +splitted[0]) {
                                return;
                            }
                            for (var i = +splitted[0]; i <= +splitted[1]; i++) {
                                seconds.push(i);
                            }
                        } else {
                            seconds.push(+interval);
                        }
                        data[index].intervals = seconds;
                        var counts = {};
                        seconds.forEach(function (x) {
                            counts[x] = (counts[x] || 0) + 1;
                        });
                        newData.push(counts);
                    });
                });
                var result = {};
                var item = null, keys = null;
                for (var c = 0; c < newData.length; c++) {
                    item = newData[c];
                    keys = Object.keys(item);
                    keys.forEach(function (key) {
                        if (!result[key]) {
                            result[key] = item[key];
                        }
                        else {
                            result[key] += item[key];
                        }
                    })
                }

                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        chartData.rows.push({c: [{v: +key}, {v: +result[key]}]});
                    }
                }

                var options = {
                    title: 'Video impressions',
                    height: 350,
                    hAxis: {
                        title: 'Time'
                    },
                    vAxis: {
                        title: 'Views'
                    }
                };
                $scope['impression_chart'] = {
                    type: 'LineChart',
                    data: chartData,
                    options: options
                };

                $scope.impressionChartBuilt = true;
            }
        }])
})();