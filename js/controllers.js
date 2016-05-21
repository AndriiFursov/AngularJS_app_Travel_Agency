/*
 * CONTROLLERS:
 *
 * MainController ($scope, $window, $location, $routeParams, viewService) - 
 *     controller for main page
 *        activeFilter - active 'type' filter
 *        currentCountry - active 'country' filter (for country sign in 
 *                index.html)
 *        loggedUser - if sale manager loged hiden tour info showed
 *        childControllers - variable used in 'scrollDirective' (define active 
 *                child controller)
 *        showRequest() - show/hide reques popup
 *        showLogin() - show/hide login popup
 *        activeBtn() - set active (pushed) button on main sareen
 *        setUser() - set 'loggedUser'
 *        getActiveFilter() - getter for 'activeFilter'
 *        selectType() - set current view
 *
 * ToursController ($scope, toursService, $routeParams) - controller for list 
 *     of tours view (main.html)
 *        tours - getter for list of tours (connect toursService method)
 *        countries - getter for list of countries (connect toursService method)
 *
 * CurrentTourController ($scope, $location, $routeParams, toursService, 
 *     carouselService) - controller for a chosen tour view (tour.html)
 *        tour - current tour properties
 *        hotel - hotel of current tour properties
 *        setActive - set active slide in carousel (connect carouselService 
 *            method)
 *        isActive - check active slide in carousel (connect carouselService 
 *            method)
 *        showNext - set next slide as active (connect carouselService method)
 *        dataLoaded - flag for showing/hiding "loading..." popup
 *        initCarousel(hotel.photos) - set current array of slides
*/


angular.module('CokTravelApp')
// controller for main page
.controller('MainController',
['$scope', '$window', '$location', '$routeParams', 'viewService', 
function MainController($scope, $window, $location, $routeParams, viewService){
    var activeFilter;
    
    $scope.currentCountry = 'all';
    $scope.loggedUser = false;
    $scope.childControllers = {}; // for 'scrollDirective'
    
    $scope.$on("$routeChangeSuccess", function () {
        var filter = $routeParams["filter"],
            currentPath = $location.path();

        if ($location.path() === '/countries') {
            activeFilter = 'countries';
        } else if ($location.path() === '/about') {
            activeFilter = 'about';
        } else if (filter) {
            activeFilter = filter;
            $scope.currentCountry = (['hotest','hot','premium','extrim'].
            indexOf(filter) === -1) ? filter : 'all';
        } else {
            activeFilter = '';
            $scope.currentCountry = 'all';
        }
    });

    $scope.showRequest = function () {
        $scope.showRequestPopup = !$scope.showRequestPopup;
    };

    $scope.showLogin = function () {
        $scope.showLoginPopup = !$scope.showLoginPopup;
    };
    
    $scope.activeBtn = function (btn) { 
        return activeFilter === btn;
    };
    
    $scope.setUser = function (a) {
        $scope.loggedUser = a;
    };
    
    $scope.getActiveFilter = function () {
        return  activeFilter;
    };
    
    $scope.selectType = function (tourType) { 
        var newPath, newFilter;
        
        newFilter = (activeFilter !== tourType && 
                        tourType !== undefined) ? tourType : '';
        
        switch (newFilter) {
            case '': 
                newPath = '/main'
            break
            case 'countries': 
                newPath = '/countries'
            break
            case 'about': 
                newPath = '/about'
            break
            default:
                newPath = '/main/' + newFilter;
        }

        $location.path(newPath);
    }

    $window.addEventListener("resize", viewService.allImagesResize);
}])





.controller('ToursController', ['$scope', 'toursService', '$routeParams', 
function ToursController($scope, toursService, $routeParams){
    toursService.showNextPack('new', $routeParams["filter"]); 
    
    $scope.childControllers.toursController = true;
    
    $scope.tours     = toursService.tours;
    $scope.countries = toursService.countries;
}])





.controller('CurrentTourController',
['$scope', '$location', '$routeParams', 'toursService', 'carouselService',
function CurrentTourController($scope, $location, $routeParams, toursService, 
carouselService){
    $scope.$on("$routeChangeSuccess", function () {
        var tourId = $routeParams["id"];
                          
                          
        toursService.initTour(tourId).then(function(answ) {
            if (answ.data.tour !== null) {
                $scope.tour       = answ.data.tour;
                $scope.hotel      = answ.data.hotel;
                $scope.setActive  = carouselService.setActive;
                $scope.isActive   = carouselService.isActive;
                $scope.showNext   = carouselService.showNext;
                carouselService.initCarousel($scope.hotel.photos);
                $scope.dataLoaded = true;
            } else {
                $location.path('/main');
            }
        });
        
        $scope.childControllers.toursController = false;
    });
}]);
