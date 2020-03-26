$(document).ready( function() {

    //hover functionalities
    $( "path" ).hover( function(){
        //get country alpha2 code
        var country_hovered = $(this).attr('id');
        var infected, deaths, recovered;


        //search for complete country name
        locations.forEach( function (location) {
            if( country_hovered === location.country_code){
                country_hovered = location.country;
                infected = location.latest.confirmed;
                deaths = location.latest.deaths;
                recovered = location.latest.recovered;
            }else{
                infected = "No data available.";
                deaths = "No data available.";
                recovered = "No data available.";
            }
        });

        //open popover with complete country name
        $(this).popover({
            html: true,
            title: country_hovered,
            content: "<span class='popover-infected'>Infected : </span>".concat(infected)
                .concat("<br><span class='popover-deaths'>Deaths : </span>").concat(deaths)
                .concat("<br><span class='popover-recovered'>Recovered : </span>").concat(recovered),
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
            if( country_clicked === location.country_code){
                console.log(location.latest);
                $('#target_coutry').text(location.country);
                $('#infetti').text(location.latest.confirmed);
                $('#deceduti').text(location.latest.deaths);
                $('#guariti').text(location.latest.recovered);
            }
        });
    });
});