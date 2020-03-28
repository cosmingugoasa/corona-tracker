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
// let thirdGraphData = {
//     //'timestamp': [confirmed, deaths, recovered],
//     //'timestamp': [confirmed, deaths, recovered],
//     //'timestamp': [confirmed, deaths, recovered],
// };

var timestamps = [];

var thirdGraphData = {};

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

        //TODO : Fix waiting for getJSON to finish
        const topCountry = locations[0];

        // setThirdGraphData(topCountry.country_code).then(function (returnedData) {
        //     thirdGraphData = returnedData;
        //     console.log("Main")
        //     console.log(returnedData);
        //     console.log(thirdGraphData);
        //     console.log(thirdGraphData["2020-01-22"]);
        // });

        thirdGraphData = setThirdGraphData(topCountry.country_code);

        setTimeout(function()
        {
            console.log(thirdGraphData);
            let confirmed =[];
            let deaths = [];
            let recovered = [];
            $.each(thirdGraphData, function (key, value) {
                confirmed.push(value[0]);
                deaths.push(value[1]);
                recovered.push(value[2]);
            });
            var thirdChart = new Chart(tctx,{
                type: 'line',
                data:{
                    labels:Object.keys(thirdGraphData),
                    datasets: [
                        //Confirmed
                        {
                            label: labels[0],
                            data:confirmed,
                            backgroundColor: colors["confirmed"]
                        },
                        //Deaths
                        {
                            label: labels[1],
                            data:deaths,
                            backgroundColor: colors["deaths"]
                        },
                        //Recovered
                        {
                            label: labels[2],
                            data:recovered,
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
                    },
                    animation: {
                        onComplete: function () {
                            $(".loader-wrapper").fadeOut("slow");
                        }
                    }
                }
            });
        }, 200);

        // setThirdGraphData(topCountry.country_code).then(result =>{
        //     var thirdGraphData = result;
        //     console.log(thirdGraphData["2020-01-22"]);
        //     //Init third graph
        //     var thirdChart = new Chart(tctx,{
        //         type: 'line',
        //         data:{
        //             labels:Object.keys(thirdGraphData),
        //             datasets: [
        //                 //Confirmed
        //                 {
        //                     label: labels[0],
        //                     data:thirdGraphData.confirmed,
        //                     backgroundColor: colors["confirmed"]
        //                 },
        //                 //Deaths
        //                 {
        //                     label: labels[1],
        //                     data:thirdGraphData.deaths,
        //                     backgroundColor: colors["deaths"]
        //                 },
        //                 //Recovered
        //                 {
        //                     label: labels[2],
        //                     data:thirdGraphData.recovered,
        //                     backgroundColor: colors["recovered"]
        //                 },
        //             ],
        //         },
        //         options: {
        //             responsive: true,
        //             maintainAspectRatio: false,
        //             legend:{
        //                 display: false,
        //                 position: 'bottom'
        //             },
        //             title:{
        //                 display: true,
        //                 text: 'Cronologia casi per '+topCountry.country
        //             }
        //         }
        //     });
        // });
        // var thirdChart = new Chart(tctx,{
        //     type: 'line',
        //     data:{
        //         labels:Object.keys(thirdGraphData),
        //         datasets: [
        //             //Confirmed
        //             {
        //                 label: labels[0],
        //                 data:thirdGraphData.confirmed,
        //                 backgroundColor: colors["confirmed"]
        //             },
        //             //Deaths
        //             {
        //                 label: labels[1],
        //                 data:thirdGraphData.deaths,
        //                 backgroundColor: colors["deaths"]
        //             },
        //             //Recovered
        //             {
        //                 label: labels[2],
        //                 data:thirdGraphData.recovered,
        //                 backgroundColor: colors["recovered"]
        //             },
        //         ],
        //     },
        //     options: {
        //         responsive: true,
        //         maintainAspectRatio: false,
        //         legend:{
        //             display: false,
        //             position: 'bottom'
        //         },
        //         title:{
        //             display: true,
        //             text: 'Cronologia casi per '+topCountry.country
        //         }
        //     }
        // });
    });
});

// function setThirdGraphData(countryCode) {
//
//     //Get all provinces IDs that have the country code
//     return $.getJSON(url.concat("locations?country_code="+countryCode)).then(function (provinces) {
//         let data = {};
//         //For every province in the country
//         $.each(provinces.locations, function(index, province){
//             //Fetch the province data (which includes the timelines)
//             return $.getJSON(url.concat("locations/"+province.id)).then(function(locationObj){
//                 //console.log(locationObj);
//                 //Loop through the different timelines (confirmed timeline, deaths timeline, recovered timeline)
//                 $.each(locationObj.location.timelines, function (type, timelineObj) {
//                     $.each(timelineObj.timeline, function (time, cases) {
//                         time = time.split("T")[0];
//                         if (typeof data[time] === 'undefined'){
//                             //Insert new timeline "node" with 0 confirmed, 0 deaths, 0 recovered
//                             data[time] = [0,0,0];
//                             timestamps.push(time);
//                         }
//                         switch (type) {
//                             case "confirmed": data[time][0] += parseInt(cases);
//                                 break;
//                             case "deaths": data[time][1] += parseInt(cases);
//                                 break;
//                             case "recovered": data[time][2] += parseInt(cases);
//                                 break;
//                         }
//                     });
//                 });
//             });
//         });
//         console.log(data);
//         thirdGraphData = data;
//         return data;
//     });
//
// }

function setThirdGraphData(countryCode) {
    let data = {};
    //Get all provinces IDs that have the country code
    $.getJSON(url.concat("locations?country_code="+countryCode), function (provinces) {
        //For every province in the country
        $.each(provinces.locations, function(index, province){
            //Fetch the province data (which includes the timelines)
            $.getJSON(url.concat("locations/"+province.id), function(locationObj){
                //console.log(locationObj);
                //Loop through the different timelines (confirmed timeline, deaths timeline, recovered timeline)
                $.each(locationObj.location.timelines, function (type, timelineObj) {
                    $.each(timelineObj.timeline, function (time, cases) {
                        time = time.split("T")[0];
                        if (typeof data[time] === 'undefined'){
                            //Insert new timeline "node" with 0 confirmed, 0 deaths, 0 recovered
                            data[time] = [0,0,0];
                            timestamps.push(time);
                        }
                        switch (type) {
                            case "confirmed": data[time][0] += parseInt(cases);
                                break;
                            case "deaths": data[time][1] += parseInt(cases);
                                break;
                            case "recovered": data[time][2] += parseInt(cases);
                                break;
                        }
                    });
                });
            });
        });
    });
    return data;
}

//TODO: Improve performance by deleting array elements after looping through them
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