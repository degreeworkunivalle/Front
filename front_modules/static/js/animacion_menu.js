var main = function(){
  
  $('.icon-menu').click(function() {
    $('.menu').animate({
      left: '0px'
    }, 200);
  });
  
  $('.icon-close').click(function(){
    $('.menu').animate({
        left:'-190px'
    },200);
  
  });
  };
 
$(document).ready(main);