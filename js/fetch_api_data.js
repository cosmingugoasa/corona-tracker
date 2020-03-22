//Array of objects, each object is a location
var locations = [];

//Single object of data
var overallData = {};

//TODO: Load charts in another js file

var fctx = document.getElementById('firstChart').getContext('2d');
var labels = ['Confermati', 'Decessi', 'Guariti'];
var colors = ['Red', 'Black', 'Green'];
var firstGraphData = [];

//API base url
var url = "https://coronavirus-tracker-api.herokuapp.com/v2/";
$(document).ready(function () {
    //Get general data
    $.getJSON(url.concat("latest"), function(data){

        overallData = data.latest;
        console.log(overallData);

        $('#infetti').text(overallData.confirmed);
        $('#deceduti').text(overallData.deaths);
        $('#guariti').text(overallData.recovered);
        $.each(overallData, function (key, value) {
            firstGraphData.push(parseInt(value));
        });

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
    $.getJSON(url.concat("locations"), function(data){
        locations = data.locations;
    });
});