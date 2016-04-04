(function () {

    angular.module('portal.video', ['ngRoute', 'datatables', 'ngNotify', 'portal.main'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/videos', {
                templateUrl: 'videos.html',
                controller: 'VideoController'
            });
        }])
        .controller('VideoController', ["config", "$scope", "$http", "$sce", "ngNotify", "chartService", "DTOptionsBuilder", "DTColumnBuilder",
            function (config, $scope, $http, $sce, ngNotify, chartService, DTOptionsBuilder, DTColumnBuilder) {
                var apiKey = 'AIzaSyAh0r3GAU-hX6w62oLc2vrXGKyzelQQMhc';

                $http({method: 'GET', url: config.serverUrls.videosUrl}).success(function (data) {
                    if(!$scope.videos) {
                        $scope.videos = data;
                        $('#videos-table').DataTable({
                            data: data,
                            bLengthChange: false,
                            bFilter: false,
                            bVisible: true,
                            columns: [
                                { data: "video_id", title: "Video ID" },
                                { data: "views", title: "Total views" },
                                { data: "last_viewed", title: "Last Viewed" }
                            ]
                        });
                    }
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
                            $scope.buildSessionsDataTable(data);
                            $scope['impressions_chart'] = chartService.buildImpressionsChart(data);
                            $scope['views_chart'] = chartService.buildViewsChart(data);
                            $http({
                                method: 'GET',
                                url: config.serverUrls.serverUrl + 'locations/country'
                            }).success(function (response) {
                                $scope['country_chart'] = chartService.drawLocChart(response, 'country');
                            });
                        } else {
                            $scope.videoNotFound = true;
                            ngNotify.set('Video not found. Maybe <a href="#create?id=' + id + '">Create a player from it</a> instead?', {
                                html: true,
                                type: 'error'
                            });
                        }
                    });
                };

                $scope.buildSessionsDataTable = function (data) {
                    $scope.sessionsTableLoaded = true;
                    $('#sessions-table').DataTable({
                        data: data,
                        bLengthChange: false,
                        bFilter: false,
                        bVisible: true,
                        columns: [
                            { data: "session_id", title: "Session" },
                            { data: "intervals", title: "Watched Intervals" }
                        ]
                    });
                    $("#sessions-table").css("width","100%");
                };

                $scope.loadYouTubePlayer = function () {
                    $http({
                        method: 'GET',
                        url: "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=" + $scope.searchVideo.videoId + "&key=" + apiKey
                    }).success(function (ytData) {
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
            }])
})();