$(document).ready( function() {
    updateCounters("GLOBAL");
    updateFirstChart("GLOBAL");
    updateSecondChart("GLOBAL");
    updateThirdChart("GLOBAL");

    //enable pan&zoom
    var panZoomTiger = svgPanZoom('#svg');

    //hover functionalities
    $( "path" ).hover( function(){
        //get country alpha2 code
        var country_hovered = $(this).attr('id');
        var infected, deaths, recovered;

        // search for complete country name
        locations.forEach( function (location) {
            if( country_hovered === location.country_code){
                country_hovered = location.country;
                infected = location.latest.confirmed;
                deaths = location.latest.deaths;
                recovered = location.latest.recovered;
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

        //TODO these updates bug out the charts when hovering over them
        //search for clicked country data
        updateCounters(country_clicked);
        updateFirstChart(country_clicked);
        updateSecondChart(country_clicked);
        // updateThirdChart(country_clicked);
    });
});