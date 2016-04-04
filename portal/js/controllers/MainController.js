(function () {
    var serverUrl = 'http://nodejs-ytapi.rhcloud.com/api/';// 'http://127.0.0.1:8888/api/';

    angular.module('portal.main', ['ngRoute', 'portal.video', 'googlechart'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'main.html'
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
        .controller('MainController', ["config", "$scope", "$http", "chartService", function (config, $scope, $http, chartService) {
            $http({method: 'GET', url: config.serverUrls.countsUrl}).success(function (data) {
                $scope.sessions = {count: data[0].session_count};
                $scope.videos = {count: data[0].video_count};
                $scope.time_watched = {count: data[0].time_watched};
                $scope.watched_percentage = {count: (data[0].time_watched / data[0].total_time * 100).toFixed(2)};
            }).error(function () {
                console.log("No connection");
            });

            $http({method: 'GET', url: config.serverUrls.videosUrl}).success(function (data) {
                data = _.sortBy(data, function(d) { return d.views * -1; }).reverse();
                data = data.slice(0,5);
                $scope.topVideos = data.reverse();
                $scope.topVideosLoaded = true;
            }).error(function () {
                console.log("No connection");
            });

            $http({
                method: 'GET',
                url: config.serverUrls.serverUrl + 'videos/lastweek'
            }).success(function (response) {
                $scope['views_chart'] = chartService.buildViewsChart(response);
                $scope['time_chart'] = chartService.buildTimeChart(response);
            });

            $http({
                method: 'GET',
                url: config.serverUrls.serverUrl + 'locations/country'
            }).success(function (response) {
                $scope['country_chart'] = chartService.drawLocChart(response, 'country');
            });

            $http({
                method: 'GET',
                url: config.serverUrls.serverUrl + 'locations/ref'
            }).success(function (response) {
                $scope['ref_chart'] = chartService.drawLocChart(response, 'ref');
            });

            $http({
                method: 'GET',
                url: config.serverUrls.browsersUrl
            }).success(function (data) {
                chartService.drawBrowsersCharts(data);
            });
        }])
})();