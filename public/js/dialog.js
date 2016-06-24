$(document).ready(function() {
    if (localStorage.getItem("shown") === null) {
        $('#overlay-back').fadeIn(500, function() {
            $('#popup').show();
            localStorage.setItem("shown", 1);
        });
    } else {
        $('#popup').hide();
    };
    document.getElementById('close').className = 'closePopup';
    $(".closePopup").on('click', function() {
        $('#popup').hide();
        $('#overlay-back').fadeOut(500);
    });

});

var clicked =false;

$(document).ready(function() {
    $("[title='Draw a Polygon']").className ='openPopup';
		if (clicked===false){
		   $('#createzonePopup').hide();	
		}
	    $(".openPopup").on('click', function(){
		clicked=true;
        $('#overlay-back').fadeIn(500, function() {
            $('#createzonePopup').show();
        });
	});
	    document.getElementById('closeCreateZone').className = 'closeZonePopup';
        $(".closeZonePopup").on('click', function() {
        $('#createzonePopup').hide();
        $('#overlay-back').fadeOut(500);
		console.log("bla");
		clicked=false;
    });
});