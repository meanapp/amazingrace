var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: true});
    
    $routeProvider
        .when('/', {
            templateUrl: 'template/main.html'
        })
        .when('/form', {
            templateUrl: 'template/form.html',
            controller: 'FormController'
        })
        .when('/rules', {
            templateUrl: 'template/rules.html'
        })
        .otherwise({redirectTo: '/'});
});


myApp.controller('FormController', ['$scope', '$http', function($scope, $http) {
    $scope.message = "Hello";
}]);