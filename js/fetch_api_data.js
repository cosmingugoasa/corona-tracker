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
});
/*

//Get latest cases : confirmed, deaths, recovered
async function getLatest(){
    const param = "latest";
    const response = await fetch(url.concat(param));
    const data = await response.json();
    //console.log(data);
    return data;
}
//Get all locations : id, country, country_code, coords{}, latest{} without timelines
async function getLocations(){
    const param = "locations?timelines=0";
    const response = await fetch(url.concat(param));
    const data = await response.json();
    console.log(data);
    //return data;
}

//TODO: Get multiple locations filtered from a list of IDs

//Get single location from id
async function getLocation(id){
    const param = "locations/"+id;
    const response = await fetch(url.concat(param));
    const data = await response.json();
    console.log(data);
    //return data;
}

//Get all locations with timelines
async function getTimelines(){
    const param = "locations?timelines=1";
    const response = await fetch(url.concat(param));
    const data = await response.json();
    console.log(data);
    //return data;
}

/*getLatest().catch(error =>{
    console.log(error);
});

getLocations();*/