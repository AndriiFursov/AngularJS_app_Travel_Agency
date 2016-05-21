/*
 * SERVICES:
 *
 * toursService - service for working with tours data
 *   private:
 *        activeFilter - filter wich used for tours selection in showNextPack 
 *                       function
 *        tours - current pack of tours wich showed on maim page
 *        countries - array with all countries
 *   publick:
 *        init() - function for getting list of tours from the server
 *        setFilter (a) - setter for the 'activeFilter' variable
 *        getTours () - getter for the array with all tours from the 'tours' 
 *                      variable
 *        getCountries () - getter for the array with all countries from the
 *                      'countries' variable
 *        initCurrentTour (tourId) - function for geting data about current tour
 *                                   from the server
 *        showNextPack (roundFlag, filter) - function for showing current pack
 *                           of tours on main page (depends on 'activeFilter')
 *
 *
 * viewService - service for working with application's view
 *   publick:
 *        allImagesResize() - function for resizing of the images in all tours
 *                          presentations
 *
 *
 * carouselService = service for tour's carousel
 *   private: 
 *        currentSlide - slide which being shown now
 *        slidesArray - array of all slides in current carousel
 *   publick:
 *        initCarousel(slidesArr) - function for setting of first slide and  
 *                                initialisation of an array of slides for 
 *                                current carousel
 *        setActive (slide) - set current slide as an active
 *        isActive (slide) - check, is the current slide an active?
 *        showNext (direction) - set next slide in array as an active
*/


angular.module('CokTravelApp')
// service for working with tours data
.factory('toursService', ['$http', '$q', function($http, $q){
    var activeFilter;
    
    var tours = [],
        countries = [];

    // publick
    function init () {
        return $q.all([
            $http.get('php/tours.php'), 
            $http.get('php/countries.php')
        ]).
        then(function(answ) {
            tours = answ[0].data;
            countries = answ[1].data;
            
            //show first pack of tours (depends of activeFilter)
            showNextPack('old', 'none');
        });
    }
    
    function setFilter (a) {
        activeFilter = a;
    }
    
    function getTours () {
        return tours;
    }
    
    function getCountries () {
        return countries;
    }
    
    function initCurrentTour (tourId) {
        return $http.get('php/currentTour.php', {params: {id: tourId}});
    } 
    
    function showNextPack(roundFlag, filter) {
        // toursQuantity - how much tours have to be shown
        var filtered = 0,
            toursQuantity = 20;


        if (filter !== 'none') { activeFilter = filter }

        if (roundFlag === 'new') {
            for (var i = 0, len = tours.length; i < len; i++) {
                if (filtered < toursQuantity && 
                    (tours[i].type === activeFilter || 
                     tours[i].countrycode === activeFilter || 
                     activeFilter === undefined)) {
                    tours[i].show = true;
                    filtered++;
                } else {
                    tours[i].show = false;
                }
            }
        } else {
            for (var i = 0, len = tours.length; i < len; i++) {
                if (filtered < toursQuantity && 
                     tours[i].show !== true &&
                     (tours[i].type === activeFilter || 
                     tours[i].countrycode === activeFilter || 
                     activeFilter === undefined)) {
                    tours[i].show = true;
                    filtered++;
                }
            }
        }
    }
    
    
    return{
        initTours:        init,
        tours:            getTours,
        countries:        getCountries,
        initTour:         initCurrentTour,
        showNextPack:     showNextPack,
        setFilter:        setFilter
    };
}])





// service for working with application's view
.factory('viewService', function(){
    // publick
    function allImagesResize () {
        var images = document.querySelectorAll('.presentation__img img');
        
        for (var i = 0; i < images.length; i++) {
            images[i].style.height = Math.round(parseInt(getComputedStyle(images[i]).width)/3*2) + "px";
        }  
    }

    
    return{
        allImagesResize: allImagesResize
    };
})





// service for tour's carousel
.factory('carouselService', function(){
    var currentSlide, slidesArray;
    
    
    // publick
    initCarousel = function (slidesArr) {
        slidesArray = slidesArr;
        currentSlide = slidesArr[0];
    }
    
    setActive = function (slide) {
        currentSlide = slide;
    } 

    isActive = function (slide) {
        return currentSlide === slide;
    } 
    
    showNext = function (direction) {
        direction = +direction;
        var nextSlide = slidesArray[slidesArray.indexOf(currentSlide) +
                                    direction];
        
        if (nextSlide) {
            currentSlide = nextSlide;
        } else if (direction === +1) {
            currentSlide = slidesArray[0];
        } else if (direction === -1) {
            currentSlide = slidesArray[slidesArray.length - 1];
        }
    }

        
    return {
        initCarousel: initCarousel,
        setActive:    setActive,
        isActive:     isActive,
        showNext:     showNext
    }
});
