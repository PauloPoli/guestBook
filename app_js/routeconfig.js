var myApp = angular.module('mainApp', ['ngRoute', 'ngStorage']);

myApp.config(function($routeProvider) {



    $routeProvider
    .when("/", {
        templateUrl : 'home.html',
        controller: 'customersCtrl'
    })
    .when("/admin", {
        templateUrl : 'adminLogin.html',
        controller: 'LoginCtrl'
    })
    
});


  