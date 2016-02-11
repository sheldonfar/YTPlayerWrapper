(function () {
    var app = angular.module('portal', [
        'ngRoute',
        'portalControllers'
    ]);

    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/videos', {
                templateUrl: 'videos.html',
                controller: 'VideoController'
            }).when('/create', {
                templateUrl: 'create.html',
                controller: 'CreatePlayerController'
            }).when('/', {
                templateUrl: 'main.html',
                controller: 'MainController'
            }).otherwise({
                redirectTo: '/'
            });
        }]);

    app.constant('config', {
        appName: 'YouTube Wrapper Portal',
        appVersion: '0.0.1',
        serverUrls: {
            serverUrl: 'http://nodejs-ytapi.rhcloud.com/api/',
            countsUrl: 'http://nodejs-ytapi.rhcloud.com/api/counts',
            browsersUrl: 'http://nodejs-ytapi.rhcloud.com/api/browsers',
            videosUrl: 'http://nodejs-ytapi.rhcloud.com/api/videos',
            specificVideoUrl: 'http://nodejs-ytapi.rhcloud.com/api/videos/video'
        }
    });

    app.filter('secondsToDateTime', [function () {
        return function (seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    }]);
})();