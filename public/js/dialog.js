$(document).ready(function() {
    $('#overlay-back').fadeIn(500, function() {
        $('#popup').show();
    });
    document.getElementById('close').className = 'closePopup';
    $(".closePopup").on('click', function() {
        $('#popup').hide();
        $('#overlay-back').fadeOut(500);
    });
    
   
});
