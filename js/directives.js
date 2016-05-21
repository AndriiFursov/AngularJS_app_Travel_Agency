/*
 * DIRECTIVES:
 *
 * resizeImgDirective ($window, viewService) - direcrive for resizing of the 
 *      image in tour presentation (used in main.html)
 *
 * scrollDirective (toursService) - direcrive for activating of next pack of 
 *      tours when list scrolled (used in main.html)
 *
 * goTopButton ($interval) - button used for scrolling to the top of the 
 *      current list of tours (used in index.html)
 *
 * tourRequestForm - popup window for sending callback request (used in 
 *      index.html)
 *
 * loginForm - popup window for login in (used in index.html)
*/


angular.module('CokTravelApp')
// direcrive for resizing of the image in tour presentation
.directive('resizeImgDirective', ['$window', 'viewService', function($window, viewService) {
    return function($scope, element, attrs) {
        element.css('height', 
            (parseInt(getComputedStyle(element[0]).width)/3*2) + "px");
    }
}])





// direcrive for activating of next pack of tours when list scrolled
.directive("scrollDirective", ['toursService', function (toursService) {
    return function($scope, element, attrs) {
        var scrollHeight, scrollTop, offsetHeight;
        
        element.bind("scroll", function() {
            scrollHeight = element.prop('scrollHeight');
            scrollTop = element.prop('scrollTop');
            offsetHeight = element.prop('offsetHeight');
            
            /* if main page is being showed and showed tours list scrolled to 
            the end - show next pack of tours */
            if ($scope.childControllers.toursController) {
                if (scrollHeight - scrollTop - offsetHeight < 100) { 
                    toursService.showNextPack('old', 'none'); 
                    $scope.$apply();
                }
            }
        });
    };
}])





// button used for scrolling to the top of the current list of tours
.directive("goTopButton", ['$interval', function ($interval) {
    return {
        restrict: 'E',
        template: '<div class="go-top-button"><img src="img/up.png" alt="scroll top"></div>',
        replace: true,
        link: function($scope, element, attrs) {
            var scrollEventFlag, scrollTop;
            var scrolableElem = element.parent();
        
            scrolableElem.bind("scroll", function() {
                scrollTop = scrolableElem.prop('scrollTop');
                
                /* if screen scrolled - show "go to top" button */
                if (scrollTop !== 0 && !scrollEventFlag) {
                    $scope.goTopButton = true;
                    scrollEventFlag = true;
                    $scope.$apply();
                } else if (scrollTop === 0) {
                    $scope.goTopButton = false;
                    scrollEventFlag = false;
                    $scope.$apply();
                }
            });
            
            element.bind("click", function() {
                var stepsQuantity = 25,
                    startPos = scrolableElem.prop('scrollTop'),
                    speed = Math.round(startPos / 100),
                    step = Math.round(startPos / stepsQuantity);
                    
                if (speed >= 20) { speed = 20 }
                
                $interval(function () {
                    var scrollTop = scrolableElem.prop('scrollTop');
                    if (scrollTop - step < 10) {
                        scrolableElem.prop('scrollTop', 0);
                        return;
                    }
                    scrolableElem.prop('scrollTop', scrollTop - step);
                }, speed, stepsQuantity);
            });
        }
    };
}])





// popup window for sending callback request
.directive("tourRequestForm", function () {
    return {
        templateUrl: "templates/tourRequestForm.html",
        replace: true,
        controller: ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http){
            $scope.tourRequest = {};
            $scope.tourRequest.tourId = $routeParams["id"];
            
            $scope.submitTourRequest = function () {
                $http.post('php/tourRequest.php',angular.toJson($scope.tourRequest))
                .then(function(answ){
                    $scope.answerState = true;
                    if (answ.data.response === 'ok') {
                        $scope.requestAnswer = "Your request have sended successful<br>Our manager will get in touch soon";
                    } else {
                        $scope.requestAnswer = "<span class='attention-strong'>ERROR!</span> Your request have not sended!<br>Try again later or call us: (050)613-31-92, (098)761-98-55, (073)475-64-56, (044)484-00-33";
                    }
                });
            };
        }]
    };
})





// popup window for login in
.directive("loginForm", function () {
    return {
        templateUrl: "templates/loginForm.html",
        replace: true,
        link: function($scope, element, attrs) {
            $scope.setUser(false);
        },
        controller: ['$scope', '$http', '$window', function ($scope, $http, $window){
            $scope.submitLoginRequest = function () {
                $http.post('php/login.php', angular.toJson($scope.loginRequest))
                .then(function(answ) {
                    $scope.loginAnswer = {};
                    if (answ.data.response === "ok") {
                        if (answ.data.user === "sale") {
                            $scope.setUser(true);
                        }
                        $scope.loginAnswer.success = true;
                    } else {
                        $scope.loginAnswer.success = false;
                    }
                });
            };
            
            $scope.logedOn = function () {
                $scope.showLogin();
                if (!$scope.loggedUser) {
                    $window.open('../tools/manager__new-tour_compatible.php', '_blank');
                }
            };
        }]
    };
});
