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

var labels = ['Confermati', 'Decessi', 'Guariti'];
var colors = ['Red', 'Grey', 'Green'];
var firstGraphData = [];

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


    //Get location based data
    $.getJSON(url.concat("locations?timelines=1"), function(data){
        locations = data.locations.sort(function (a, b) {
            //Order descending
            return (parseInt(a.latest.confirmed) - parseInt(b.latest.confirmed)) * -1;
        });
        console.log(locations);
    });
});