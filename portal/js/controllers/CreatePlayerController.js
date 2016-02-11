(function () {

    angular.module('portal.create', ['ngRoute', 'portal.main'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/create', {
                templateUrl: 'create.html',
                controller: 'CreatePlayerController'
            });
        }])

        .controller('CreatePlayerController', ["config", "$scope", "$http", function (config, $scope, $http) {
        }])
})();