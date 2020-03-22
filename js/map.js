$(document).ready( function() {
    //hover functionalities
    $( "path" ).hover( function(){
        //get country alpha2 code
        var country_hovered = $(this).attr('id');
        //search for complete country name
        locations.forEach( function (location) {
            if( country_hovered == location.country_code){
                country_hovered = location.country;
            }
        });
        //open popover with complete country name
        $(this).popover({
            title: country_hovered,
            content: "Click to see the counter for this country.",
            container: 'body'
        });
    });

    //click functionalities
    $( "path" ).click( function () {
        //get clicked country alpha2 code
        var country_clicked = $(this).attr('id');
        console.log(country_clicked);
        //search for clicked country data
        locations.forEach( function (location) {
            if( country_clicked == location.country_code){
                console.log(location.latest);
                $('#target_coutry').text(location.country);
                $('#infetti').text(location.latest.confirmed);
                $('#deceduti').text(location.latest.deaths);
                $('#guariti').text(location.latest.recovered);
            }
        });
    });
});
