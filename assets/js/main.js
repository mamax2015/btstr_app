$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    dots:false,
    items:3,
    autoplay:true,
    autoplayTimeout:2000,
    responsive:{
      0 : {
        items:1
      },
      640 : {
        items:2
      },
      800 : {
        items:3
      }
    }    
  });
});