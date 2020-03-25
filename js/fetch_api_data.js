//Array of objects, each object is a location
var locations = [];

//Single object of data
var overallData = {};

//API base url
var url = "https://coronavirus-tracker-api.herokuapp.com/v2/";
$(document).ready(function () {
    //Get general data
    $.getJSON(url.concat("latest"), function(data){

        overallData = data;

        $('#infetti').text(overallData.latest.confirmed);
        $('#deceduti').text(overallData.latest.deaths);
        $('#guariti').text(overallData.latest.recovered);
    });


    //Get location based data
    $.getJSON(url.concat("locations"), function(data){
        locations = data.locations;
    });

    //Loading overlay
    $(window).on("load",function(){
        $(".loader-wrapper").fadeOut("slow");
    });

});