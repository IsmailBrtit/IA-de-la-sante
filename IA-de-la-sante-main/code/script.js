$(document).ready(function() {
    $('#btn1').change(function() {
      $('.element1-left .extra, .element1-left .dots').toggle();
    });
  
    $('#btn2').change(function() {
      $('.element1-right .extra, .element1-right .dots').toggle();
    });
  });
    


  document.addEventListener("DOMContentLoaded", function() {
    var trustTextElements = document.getElementsByClassName("trustText");

    var originalTexts = [];
    for (var i = 0; i < trustTextElements.length; i++) {
        originalTexts.push(trustTextElements[i].innerHTML);
    }

    function adjustLineBreaks() {
        for (var i = 0; i < trustTextElements.length; i++) {
            if (window.innerWidth <= 768) {
                trustTextElements[i].innerHTML = originalTexts[i].replace(/<br\s*\/?>/gi, ' ');
            } else {
                trustTextElements[i].innerHTML = originalTexts[i];
            }
        }
    }

    // Appelle la fonction lors du chargement de la page
    adjustLineBreaks();

    // Appelle la fonction lorsque la taille de la fenêtre change
    window.addEventListener('resize', adjustLineBreaks);
});



//change h3 to h2 in class=element1 when min-width: 1800px
window.addEventListener('load', function() {
  // Check if the screen width meets the condition
  if (window.matchMedia("(min-width: 1800px)").matches) {
      // If the condition is met, change the tag from h3 to h2
      document.querySelectorAll('.element1 h3').forEach(function(el) {
          el.outerHTML = '<h2>' + el.innerHTML + '</h2>';
      });
  }
});
