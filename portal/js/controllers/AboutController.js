(function () {

    angular.module('portal.about', ['ngRoute', 'portal.main'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/about', {
                templateUrl: 'about.html',
                controller: 'AboutController'
            });
        }])

        .controller('AboutController', ["config", "$scope", function (config, $scope) {
            $scope.author = 'Yevhenii Minin';
            $scope.version = config.appVersion;
        }])
})();