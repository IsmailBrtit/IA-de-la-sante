$(document).ready(function() {
    $('#btn1').change(function() {
      $('.element1-left .extra, .element1-left .dots').toggle();
    });
  
    $('#btn2').change(function() {
      $('.element1-right .extra, .element1-right .dots').toggle();
    });
  });
    