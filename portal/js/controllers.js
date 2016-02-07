(function () {
    var portalControllers = angular.module('portalControllers', [
        'ngNotify'
    ]);

    portalControllers.controller('MainController', function (config, $scope, $http) {
        $http({method: 'GET', url: config.serverUrls.countsUrl}).success(function (data) {
            $scope.sessions = {count: data[0].session_count};
            $scope.videos = {count: data[0].video_count};
            $scope.time_watched = {count: data[0].time_watched};
            $scope.watched_percentage = {count: (data[0].time_watched / data[0].total_time * 100).toFixed(2)};
        });
    });

    portalControllers.controller('VideoController', function (config, $scope, $http, $sce, ngNotify) {
        var apiKey = 'AIzaSyAh0r3GAU-hX6w62oLc2vrXGKyzelQQMhc';

        $http({method: 'GET', url: config.serverUrls.videosUrl}).success(function (data) {
            $scope.videos = data;
            $('#videos-table').DataTable({
                retrieve: true,
                "bLengthChange": false
            });
        });

        ngNotify.config({
            theme: 'pure',
            position: 'bottom',
            duration: 2000
        });

        this.getVideoData = function (id) {
            if(!id) {
                ngNotify.set('Video id is empty!', 'warn');
            }
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = id.match(regExp);
            if (match && match[2].length == 11) {
                id = match[2];
            }
            $scope.searchVideo = {videoId: id, loaded: false};
            $http({
                method: 'GET',
                params: {videoId: id},
                url: config.serverUrls.specificVideoUrl
            }).success(function (data) {
                if (data.length > 0) {
                    $scope.searchVideo.embedCode =  $sce.trustAsHtml('<iframe class="embed-responsive-item" src="//www.youtube.com/embed/' + id + '"></iframe>');
                    $scope.searchVideo.sessions = [];
                    $.each(data, function (i, item) {
                        $scope.searchVideo.sessions[i] = {sessionId: item.session_id, fragments: []};
                        var time_from = item.all_time_from.split(',');
                        var time_to = item.all_time_to.split(',');
                        for (var j = 0; j < time_from.length; j++) {
                            var fragment = time_from[j] + ' - ' + time_to[j];
                            fragment += (j < time_from.length - 1) ? ', ' : '';
                            $scope.searchVideo.sessions[i].fragments.push(fragment);
                        }
                    });
                    $scope.loadYouTubePlayer();
                } else {
                    ngNotify.set('Unable to find video! :(', 'error');
                }
            });
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
                $scope.searchVideo.loaded = true;
            });
            ngNotify.set('Video found! :)', 'success');
        };


    });
})();