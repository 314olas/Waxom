
import collapse from "./src/js/collapse.js";
//import slick from "./src/js/slick.min.js"


$(document).ready(function(){
  $('.slider-portfolio-template').slick({
    dots: true
  });
  $('.posts-slider').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
      }
    },
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 690,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
  });

  $('#search').click(function(e){
    e.preventDefault();
    $('#search-form').toggleClass('show');
  })
});

