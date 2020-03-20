const url = "https://coronavirus-tracker-api.herokuapp.com/v2/latest";

async function getLatest(){
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
}

getLatest();