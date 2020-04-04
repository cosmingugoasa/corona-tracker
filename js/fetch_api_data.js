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

const colors = {'confirmed': 'Orange', 'deaths': 'Red', 'recovered': 'Green'};

const labels = ['Confermati', 'Decessi', 'Guariti'];

function updateCounters(countryCode){
    let urlParam = "";

    if(countryCode === "GLOBAL"){
        urlParam = "latest";
    }else{
        urlParam = `locations?country_code=${countryCode}&timelines=false`;
    }

    $.getJSON(url.concat(urlParam), function (apiData) {
        $('#infetti').text(apiData.latest.confirmed);
        $('#deceduti').text(apiData.latest.deaths);
        $('#guariti').text(apiData.latest.recovered);
    });
}

function updateFirstChart(countryCode){
    let urlParam;

    //Change api url request based on the countryCode param
    if(countryCode === "GLOBAL"){
        urlParam = "latest";
    }else{
        urlParam = `locations?source=jhu&country_code=${countryCode}&timelines=false`;
    }

    //Update first chart
    $.getJSON(url.concat(urlParam),function (apiData) {
        //Total numbers of confirmed, deaths and recovered
        let firstChartData = [];
        let firstChartTitle;
        if(countryCode === "GLOBAL"){
            firstChartTitle = "Casi globali";
        }else{
            firstChartTitle = `Casi per ${apiData.locations[0].country}`;
        }

        $.each(apiData.latest, function (key, value) {
            firstChartData.push(parseInt(value));
        });

        //Init chart
        let firstChart = new Chart(fctx, {
            type: 'pie',
            data:{
                datasets:[{
                    data:firstChartData,
                    backgroundColor: [colors["confirmed"],colors["deaths"],colors["recovered"]],
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
                    text: firstChartTitle
                }
            },
        });
    });
}

function updateSecondChart(countryCode){
    let urlParam;
    let secondChartTitle;

    //Change api url request based on the countryCode param
    if(countryCode === "GLOBAL"){
        urlParam = "locations";
    }
    //If the US is selected we need to change sources to csbs since it has more accurate data
    else if(countryCode === "US"){
        urlParam = `locations?source=csbs&country_code=${countryCode}&timelines=false`;
    }else{
        urlParam = `locations?source=jhu&country_code=${countryCode}&timelines=false`;
    }

    //Update second chart data
    $.getJSON(url.concat(urlParam), function (apiData) {
        //Top countries by the total number of confirmed cases
        let secondChartData = {
            //Names of the countries (or provinces if countrycode is given) with most confirmed
            locationName: [],
            //Number of confirmed cases per country
            confirmed: [],
            //Number of deaths per country
            deaths: [],
            //Number of recovered per country
            recovered: []
        };

        let orderedLocations = [];

        //If the selected country is the US then we need to group by county for each province
        if(countryCode === "GLOBAL"){
            orderedLocations = sortByCases(groupByProvince(sortByName(apiData.locations)));
            //Pick top 5 countries
            orderedLocations.slice(0, 5).map(location => {
                secondChartData.locationName.push(location.country);
            });
        }
        //Else we can group by province (or country name if GLOBAL is passed in countryCode) for the other countries (jhu doesn't have individual county data per country)
        else{
            orderedLocations = sortByCases(apiData.locations);
            //Pick top 5 counties
            orderedLocations.slice(0, 5).map(location => {
                if(location.county){
                    secondChartData.locationName.push(location.county);
                }else if(location.province){
                    secondChartData.locationName.push(location.province);
                }else{
                    secondChartData.locationName.push(location.country);
                }
            });
        }

        orderedLocations.slice(0, 5).map(location => {
            secondChartData.confirmed.push(parseInt(location.latest.confirmed));
            secondChartData.deaths.push(parseInt(location.latest.deaths));
            secondChartData.recovered.push(parseInt(location.latest.recovered));
        });

        if(countryCode === "GLOBAL"){
            secondChartTitle = "Classifica globale dei contagi";
        }else{
            secondChartTitle = `Casi per ${orderedLocations[0].country}`;
        }

        //Init second graph
        let secondChart = new Chart(sctx,{
            type: 'horizontalBar',
            data:{
                labels: secondChartData.locationName,
                datasets: [
                    {
                        label: labels[0],
                        data: secondChartData.confirmed,
                        backgroundColor: colors["confirmed"],
                    },
                    {
                        label: labels[1],
                        data: secondChartData.deaths,
                        backgroundColor: colors["deaths"],
                    },
                    {
                        label: labels[2],
                        data: secondChartData.recovered,
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
                    text: secondChartTitle
                }
            }
        });

    });
}

function updateThirdChart(countryCode){
    let urlParam;

    //Change api url request based on the countryCode param
    if(countryCode === "GLOBAL"){
        urlParam = "locations";
    }
    //If the US is selected we need to change sources to csbs since it has more accurate data
    else if(countryCode === "US"){
        urlParam = `locations?source=csbs&country_code=${countryCode}&timelines=false`;
    }else{
        urlParam = `locations?source=jhu&country_code=${countryCode}&timelines=false`;
    }

    //Update third chart
    $.getJSON(url.concat(),function (apiData) {
        let timestamps = [];

        let thirdChartData = {};

        var thirdChart = new Chart(tctx,{
                type: 'line',
                data:{
                    labels:Object.keys(thirdGraphData).slice(daysToSkip),
                    datasets: [
                        //Confirmed
                        {
                            label: labels[0],
                            data:confirmed.slice(daysToSkip),
                            backgroundColor: colors["confirmed"]
                        },
                        //Deaths
                        {
                            label: labels[1],
                            data:deaths.slice(daysToSkip),
                            backgroundColor: colors["deaths"]
                        },
                        //Recovered
                        {
                            label: labels[2],
                            data:recovered.slice(daysToSkip),
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
                            alert("JHU (our main data provider) no longer provides data for amount of recoveries, and as a result, the API will be showing 0 for this statistic. Apologies for any inconvenience. Hopefully we'll be able to find an alternative data-source that offers this.");
                        }
                    }
                }
            });
    });
}

//TODO: Move into update third chart method
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

function sortByName(locations){
    //Order the locations by name
    locations = locations.sort(function (a, b) {
        if (a.country_code < b.country_code){
            return -1;
        } else if( a.country_code > b.country_code){
            return 1;
        }else{
            return 0;
        }
    });

    return locations;
}

//Sort by descending number of confirmed cases
function sortByCases(locations){
    locations = locations.sort(function (a, b) {
        //Order descending
        return (parseInt(a.latest.confirmed) - parseInt(b.latest.confirmed)) * -1;
    });

    return locations;
}

function groupByProvince(locations) {
    //Array of all the provinces grouped into their countries
    let groupedLocations = [];
    let index = locations.length;

    while(index--){
        let pos = -1;
        //Look in the array to see if there's already a province with the country code of the location
        if(groupedLocations.length > 0){
            let cont = 0;
            groupedLocations.forEach(loc =>{
                if(loc.country_code === locations[index].country_code){
                    pos = cont;
                }
                cont++;
            });
        }

        //Add the latest data to the location saved in the array
        if(pos !== -1){
            groupedLocations[pos].latest.confirmed = parseInt(groupedLocations[pos].latest.confirmed) + parseInt(locations[index].latest.confirmed);
            groupedLocations[pos].latest.deaths = parseInt(groupedLocations[pos].latest.deaths) + parseInt(locations[index].latest.deaths);
            groupedLocations[pos].latest.recovered = parseInt(groupedLocations[pos].latest.recovered) + parseInt(locations[index].latest.recovered);

        }else{
            //Else add to the groupedLocation array as a new location
            groupedLocations.push(locations[index]);

        }
        locations.splice(index, 1);
    }
    // console.log(groupedLocations);
    return groupedLocations;
}