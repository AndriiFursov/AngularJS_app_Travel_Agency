/*
 * MAIN
*/


"use strict";
angular.module('CokTravelApp', ["ngRoute", "ngSanitize"])
    .config(['$routeProvider', '$locationProvider', 
    function($routeProvider, $locationProvider){
        $locationProvider.hashPrefix('!');
        
        $routeProvider.when('/main', {
            templateUrl:'views/main.html',
            controller:'ToursController'
        })
        .when('/main/:filter', {
            templateUrl:'views/main.html',
            controller:'ToursController'
        })
        .when('/countries', {
            templateUrl:'views/countries.html',
            controller:'ToursController'
        })
        .when('/tour/:id', {
            templateUrl:'views/tour.html',
            controller:'CurrentTourController'
        })
        .when('/about', {
            templateUrl:'views/about.html',
            controller:'ToursController'
        })
        .otherwise({redirectTo: '/main'});
    }])
    
    
    
    
    
    .run(['toursService', function(toursService){
        toursService.initTours(); // list of tours initialization
    }])