$(document).ready(function () {
    //disable button (input field empty)
    $( '#search-button' ).attr('disabled', true);

    //enable button only if input field is not empty
    $( '#input' ).keyup( function () {
        if($(this).val().length == 0){
            $( '#search-button' ).attr('disabled', true);
        }else{
            $( '#search-button' ).attr('disabled', false);
        }
    });

    //search country by full name, and display info
    $( '#search-button' ).click( function () {
        var input = $('#input').val();
        locations.forEach( function (location) {
            if( input == location.country){
                $('#target_coutry').text(location.country);
                $('#infetti').text(location.latest.confirmed);
                $('#deceduti').text(location.latest.deaths);
                $('#guariti').text(location.latest.recovered);
            }
        });
    })

    /*SUBSCRIBE BUTTON*/
    //disable button (input field empty)
    //$( '#sub-button' ).attr('disabled', true);

    //enable button only if input field is not empty
    $( '#email' ).keyup( function () {
        if($(this).val().length == 0){
            $( '#sub-button' ).attr('disabled', true);
        }else{
            $( '#sub-button' ).attr('disabled', false);
        }
    });

    $( '#sub-button' ).click(function () {
        console.log("sub clicked ");
    })

});