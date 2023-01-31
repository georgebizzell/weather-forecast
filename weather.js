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

var todayWeather;
var todayTemp;
var todayWind;
var todayHumidity;
var searchedCity;
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

     // Storing the search history
     
     foundCity = response[0].name;

     console.log("Search history = " + foundCity);

     // Creating an element to have the searched city displayed
     var foundCityItem = $("<li>").addClass("m-1 p-2 border-dark border rounded").text(foundCity);

     $("#history").prepend(foundCityItem);

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

    console.log("Weather = " + JSON.stringify(response.list[0].weather[0].main));

    console.log("Temp = " + JSON.stringify(response.list[0].main.temp));

    console.log("Wind = " + JSON.stringify(response.list[0].wind.speed));

    console.log("Humidity = " + JSON.stringify(response.list[0].main.humidity));

    // Store key values in variables
    
    todayWeather = JSON.stringify(response.list[0].weather[0].main);
    todayTemp = JSON.stringify(response.list[0].main.temp);
    todayWind = JSON.stringify(response.list[0].wind.speed)
    todayHumidity = JSON.stringify(response.list[0].main.humidity)

    todayTemp = (+todayTemp - 273.15)

    todayTemp = Math.round((todayTemp + Number.EPSILON) * 100) / 100

    // Reset today's forecast for the searched city

    console.log("City = " + foundCity);

    $("#today").empty();

    $("#today").append($("<h2>").text(foundCity)).addClass("pb-3");
    $("#today").append($("<p>").text("Temp: " + todayTemp + " \u00B0C"));
    $("#today").append($("<p>").text("Wind: " + todayWind + " kph"));
    $("#today").append($("<p>").text("Humidity: " + todayHumidity + "%"));

    }
   )
}