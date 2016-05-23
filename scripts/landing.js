(function () {
  "use strict";

  var pointsArray = document.getElementsByClassName('point'),

    animatePoints = function (points) {

      var revealPoints = function (index) {
        points[index].style.opacity = 1;
        points[index].style.transform = "scaleX(1) translateY(0)";
        points[index].style.msTransform = "scaleX(1) translateY(0)";
        points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
      };

      forEach(revealPoints, points);

    },

    animateHero = function () {

      var heroTitle = document.getElementsByClassName("hero-title");

      heroTitle[0].style.opacity = 1;
      heroTitle[0].style.letterSpacing = "0.5rem";

    };
  
  window.onload = function () {
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0],
      scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

    animateHero();
    
    if (window.innerHeight > 950) {
      animatePoints(pointsArray);
    } else {
      window.addEventListener('scroll', function (event) {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
          animatePoints(pointsArray);
        }
      });
    }
    
  };

}());