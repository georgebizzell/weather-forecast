// Geocoding call to retrieve lat and long of city locations

var city;
var apiKey = "2933b3fe604fbe44454b6387b8704dd7";
var geoQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;


// Geo-encoding call = http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


// Weather API call & key

var lat;
var lon;
var weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

// Example: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var todayTemp;
var todayWind;
var todayHumidity;
var city;

//Search button action function
$("#search-button").on("click", function(event) {
    event.preventDefault();

    // This line grabs the input from the textbox
    city = $("#search-input").val().trim();
 
    // Calling renderButtons which handles the processing of our movie array
    getLatLon(city);

  });

  function getLatLon(city) {

    var geoQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    
   // Make an async ajax call to retrieve lat and lon
   $.ajax({
     url: geoQueryURL,
     method: "GET"
   }).then(function(response) {

    console.log(response);

     // Retrieve the lat and lon from the response for the city
     lat = response[0].lat;
     lon = response[0].lon;

     console.log("Lat = " + lat);
     console.log("Lon = " + lon);

     // Storing the rating data
     var searchHistory = response[0].name;

     console.log("Search history = " + searchHistory);

     // Creating an element to have the searched city displayed
     var searchedCity = $("<li>").addClass("m-1 p-2 border-dark border rounded").text(searchHistory);

     console.log(searchedCity);

     $("#history").prepend(searchedCity);

     getWeather(lat, lon);

       }
    )
}

// Get Weather working

function getWeather (lat, lon) {

    var weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    
    console.log(weatherQueryURL);

   // Make an async ajax call to retrieve lat and lon
   $.ajax({
     url: weatherQueryURL,
     method: "GET"
   }).then(function(response) {

    // Log the response and key values

    console.log("Response = " + JSON.stringify(response));

    console.log("Temp = " + JSON.stringify(response.list[0].main.temp));

    console.log("Wind = " + JSON.stringify(response.list[0].wind.speed));

    console.log("Humidity = " + JSON.stringify(response.list[0].main.humidity));

    // Store key values in variables
    
    
    todayTemp = JSON.stringify(response.list[0].main.temp);
    todayWind = JSON.stringify(response.list[0].wind.speed)
    todayHumidity = JSON.stringify(response.list[0].main.humidity)

    todayTemp = (+todayTemp - 273.15)

    todayTemp = Math.round((todayTemp + Number.EPSILON) * 100) / 100

    // Reset today's forecast for the searched city

    console.log("City = " + city);

    $("#today").empty();

    $("#today").append($("<h2>").text(city)).addClass("pb-3");
    $("#today").append($("<p>").text("Temp: " + todayTemp + "\u00B0C"));
    $("#today").append($("<p>").text("Wind: " + todayWind));
    $("#today").append($("<p>").text("Humidity: " + todayHumidity));

    }
   )
}