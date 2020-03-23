//Array of objects, each object is a location
var locations = [];

//Single object of data
var overallData = {};

//TODO: Load charts in another js file

//First chart (Pie chart with global stats or stats of selected country)
var fctx = document.getElementById('firstChart').getContext('2d');

//Second chart(Horizontal bar chart with top 5 infected countries)
var sctx = document.getElementById('secondChart').getContext('2d');

//Third chart(Line chart with timeline of most infected country or selected country)
var tctx = document.getElementById('thirdChart').getContext('2d');

//TODO: Use associative array (Confirmed -> red, deaths -> grey, etc...)
var colors = ['Red', 'Grey', 'Green'];

var labels = ['Confermati', 'Decessi', 'Guariti'];

//TODO: Find another way or place to initialize these arrays

//Total numbers of confirmed, deaths and recovered
var firstGraphData = [];

var secondGraphData = {
    //Names of the countries with most confirmed
    countriesLabels: [],
    //Number of confirmed cases per country
    confirmed: [],
    //Number of deaths per country
    deaths: [],
    //Number of recovered per country
    recovered: []
};

var thirdGraphData = [];

//API base url
var url = "https://coronavirus-tracker-api.herokuapp.com/v2/";
$(document).ready(function () {
    //Get general data
    $.getJSON(url.concat("latest"), function(data){

        overallData = data.latest;
        //console.log(overallData);

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
                   backgroundColor: colors
               }],
               labels: labels
           },

            options: {
               responsive: true,
               maintainAspectRatio: false,
               legend:{
                   position: 'bottom'
               },
               title:{
                   display: true,
                   text: 'Casi globali'
               }
            }
        });
    });

    //TODO: Province grouping
    //Get location based data
    $.getJSON(url.concat("locations?timelines=1"), function(data){
        locations = data.locations.sort(function (a, b) {
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

        //console.log(secondGraphData);

        //Init second graph
        var secondChart = new Chart(sctx,{
            type: 'horizontalBar',
            data:{
                labels: secondGraphData.countriesLabels,
                datasets: [
                    {
                        label: labels[0],
                        data: secondGraphData.confirmed,
                        backgroundColor: colors[0],
                    },
                    {
                        label: labels[1],
                        data: secondGraphData.deaths,
                        backgroundColor: colors[1],
                    },
                    {
                        label: labels[2],
                        data: secondGraphData.recovered,
                        backgroundColor: colors[2],
                    },
                ],
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend:{
                    position: 'bottom'
                },
                title:{
                    display: true,
                    text: 'Classifica dei contagi'
                }
            }
        });
    });
});