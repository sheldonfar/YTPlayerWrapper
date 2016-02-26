(function () {
    var app = angular.module('portal', [
        'ngRoute',
        'portal.main',
        'portal.video',
        'portal.create',
        'portal.about'
    ]);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({redirectTo: '/'});
    }]);

    app.filter('secondsToDateTime', [function () {
        return function (seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    }]);
})();