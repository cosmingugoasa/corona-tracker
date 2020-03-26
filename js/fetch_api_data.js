//API base url
const url = "https://coronavirus-tracker-api.herokuapp.com/v2/";

//Array of objects, each object is a location
let locations = [];

//Single object of data
let overallData = {};

//First chart (Pie chart with global stats or stats of selected country)
const fctx = document.getElementById('firstChart').getContext('2d');

//Second chart(Horizontal bar chart with top 5 infected countries)
const sctx = document.getElementById('secondChart').getContext('2d');

//Third chart(Line chart with timeline of most infected country or selected country)
const tctx = document.getElementById('thirdChart').getContext('2d');

const colors = {'confirmed': 'Red', 'deaths': 'Grey', 'recovered': 'Green'};

const labels = ['Confermati', 'Decessi', 'Guariti'];

//Total numbers of confirmed, deaths and recovered
let firstGraphData = [];

//Top countries by the total number of confirmed cases
let secondGraphData = {
    //Names of the countries with most confirmed
    countriesLabels: [],
    //Number of confirmed cases per country
    confirmed: [],
    //Number of deaths per country
    deaths: [],
    //Number of recovered per country
    recovered: []
};

//Timeline of the country with the most confirmed cases
let thirdGraphData = {
    'timestamps': [],
    //Number of confirmed cases per country
    'confirmed': [],
    //Number of deaths per country
    'deaths': [],
    //Number of recovered per country
    'recovered': []
};

$(document).ready(function () {

    //Get location based data
    $.getJSON(url.concat("locations?timelines=1"), function(data){

        overallData = data.latest;

        $('#infetti').text(overallData.confirmed);
        $('#deceduti').text(overallData.deaths);
        $('#guariti').text(overallData.recovered);

        $.each(overallData, function (key, value) {
            firstGraphData.push(parseInt(value));
        });

        //Init first graph
        var firstChart = new Chart(fctx,{
            type: 'pie',
            data:{
                datasets: [{
                    data: firstGraphData,
                    backgroundColor:[colors["confirmed"],colors["deaths"],colors["recovered"]]
                }],
                labels: labels
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend:{
                    display: false,
                    position: 'bottom'
                },
                title:{
                    display: true,
                    text: 'Casi globali'
                }
            }
        });

        locations = data.locations.sort(function (a, b) {
            if (a.country_code < b.country_code){
                return -1;
            } else if( a.country_code > b.country_code){
                return 1;
            }else{
                return 0;
            }
        });
        locations = groupByProvince(locations);

        locations = locations.sort(function (a, b) {
            //Order descending
            return (parseInt(a.latest.confirmed) - parseInt(b.latest.confirmed)) * -1;
        });

        //Get cases info from top 5 infected countries
        locations.slice(0, 5).map(location => {
            secondGraphData.countriesLabels.push(location.country);
            secondGraphData.confirmed.push(parseInt(location.latest.confirmed));
            secondGraphData.deaths.push(parseInt(location.latest.deaths));
            secondGraphData.recovered.push(parseInt(location.latest.recovered));
        });

        //Init second graph
        var secondChart = new Chart(sctx,{
            type: 'horizontalBar',
            data:{
                labels: secondGraphData.countriesLabels,
                datasets: [
                    {
                        label: labels[0],
                        data: secondGraphData.confirmed,
                        backgroundColor: colors["confirmed"],
                    },
                    {
                        label: labels[1],
                        data: secondGraphData.deaths,
                        backgroundColor: colors["deaths"],
                    },
                    {
                        label: labels[2],
                        data: secondGraphData.recovered,
                        backgroundColor: colors["recovered"],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend:{
                    display: true,
                    position: 'bottom'
                },
                title:{
                    display: true,
                    text: 'Classifica dei contagi'
                }
            }
        });

        const topCountry = locations[0];
        console.log(topCountry);
        setThirdGraphData(topCountry.timelines);

        //Init third graph
        var thirdChart = new Chart(tctx,{
            type: 'line',
            data:{
                labels:thirdGraphData.timestamps,
                datasets: [
                    //Confirmed
                    {
                        label: labels[0],
                        data:thirdGraphData.confirmed,
                        backgroundColor: colors["confirmed"]
                    },
                    //Deaths
                    {
                        label: labels[1],
                        data:thirdGraphData.deaths,
                        backgroundColor: colors["deaths"]
                    },
                    //Recovered
                    {
                        label: labels[2],
                        data:thirdGraphData.recovered,
                        backgroundColor: colors["recovered"]
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend:{
                    display: false,
                    position: 'bottom'
                },
                title:{
                    display: true,
                    text: 'Cronologia casi per '+topCountry.country
                }
            }
        });
    });
});

function setThirdGraphData(timelines){
    //Key,value pair array
    let timeLinesSaved = false;
    $.each(timelines, function (key, cases) {
        $.each(cases.timeline, function (time, number) {
            if(!timeLinesSaved){
                thirdGraphData["timestamps"].push(time.split("T")[0]);
            }
            thirdGraphData[key].push(number);
        });
        timeLinesSaved = true;
    });
    console.log(thirdGraphData);
}

function groupByProvince(locations) {
    //Array of all the provinces grouped into their countries
    let groupedLocations = [];
    locations.forEach(location =>{
        let pos = -1;
        //Look in the array to see if there's already a province with the country code of the location
        if(groupedLocations.length > 0){
            let cont = 0;
            groupedLocations.forEach(loc =>{
                if(loc.country_code === location.country_code){
                    pos = cont;
                }
                cont++;
            });
        }

        //Add the latest data to the location saved in the array
        if(pos !== -1){
            groupedLocations[pos].latest.confirmed = parseInt(groupedLocations[pos].latest.confirmed) + parseInt(location.latest.confirmed);
            groupedLocations[pos].latest.deaths = parseInt(groupedLocations[pos].latest.deaths) + parseInt(location.latest.deaths);
            groupedLocations[pos].latest.recovered = parseInt(groupedLocations[pos].latest.recovered) + parseInt(location.latest.recovered);
        }else{
            //Else add to the groupedLocation array as a new location
            groupedLocations.push(location);
        }
    });
    // console.log(groupedLocations);
    return groupedLocations;
}