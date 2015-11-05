var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: true});
    
    $routeProvider
        .when('/', {
            templateUrl: 'views/template/main.html'
        })
        .when('/form', {
            templateUrl: 'views/template/form.html',
            controller: 'FormController'
        })
        .when('/rules', {
            templateUrl: 'views/template/rules.html'
        })
        .when('/duplicate', {
            templateUrl: 'views/template/duplicate.html'
        })
        .when('/success', {
            templateUrl: 'views/template/success.html'
        })    
        .when('/error', {
            templateUrl: 'views/template/error.html'
        })
        .when('/completeregister/:id', {
            templateUrl: 'views/template/confirm.html',
            controller: 'ConfirmationController'
        })
        .when('/complete', {
            templateUrl: 'views/template/confirm.html'
        })
        .otherwise({redirectTo: '/'});
});

myApp.controller('ConfirmationController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
    $http.put('http://localhost:3000/api/confirmUser/' + $routeParams.id)
        .success(function(response) {
            if(response.status === 200) {
                $location.path('/complete');
            } else {
                $location.path('/error');
            }
    });
}]);


myApp.controller('FormController', ['$scope', '$http', '$location', function($scope, $http, $location) {    
    $scope.user = {};
    
    $scope.register = function() {
        $scope.user.emailaddress = $scope.user.emailaddress + "@quinnox.com";
        $http.post('http://localhost:3000/api/register', angular.toJson($scope.user))
            .success(function(response) {
                console.log(response);
                 if(response.status === 305) {
                     $location.path('/duplicate');
                 } else if(response.status === 200) {
                    $location.path('/success');
                 } else {
                     $location.path('/error');
                 }
        });
    }
}]);