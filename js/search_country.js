$(document).ready(function () {
    //disable button (input field empty)
    $( '#search_button' ).attr('disabled', true);

    //enable button only if input field is not empty
    $( '#input' ).keyup( function () {
        if($(this).val().length == 0){
            $( '#search_button' ).attr('disabled', true);
        }else{
            $( '#search_button' ).attr('disabled', false);
        }
    });

    //search country by full name, and display info
    $( '#search_button' ).click( function () {
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
});