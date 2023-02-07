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

var searchHistory = [];

localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

var numberofdays = 5;

function displayHistory () {

  $("#history").empty();

  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  const setSearchHistory = new Set(searchHistory);

  const arraySearchHistory = Array.from(setSearchHistory);

  const arraySearchHistorySlice = arraySearchHistory.slice(0, 7);

  arraySearchHistorySlice.forEach(renderHistory);
  
  function renderHistory(city) {

    var listCity = $("<li>").addClass("historyItem m-1 p-2 border-dark border rounded").text(city);

    $("#history").append(listCity);

  }

}


//Search button action function
$("#search-button").on("click", function(event) {
    event.preventDefault();

    // This line grabs the input from the textbox
    city = $("#search-input").val().trim();
 
    // Calling geocoding function
    getLatLon(city);

  });

  //Historical seach button action function
  $(document).on('click', '.historyItem', function(event) { 
    event.preventDefault();

    // This line grabs the input from the textbox
      var city = $(this).html().trim();
      console.log(city);
  
    // Calling geocoding function
    getLatLon(city);
    });

  function getLatLon(city) {

    console.log("Searched city is = " + city);

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

    // Retrieve the city's correct name as returned by the respone
     
     currentCity = response[0].name;

    // Retrieving the search history

     var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

     // De-duplicating the search history by turning it into a Set

     searchHistory.unshift(currentCity);

     const setSearchHistory = new Set(searchHistory);

     const arraySearchHistory = Array.from(setSearchHistory);

     // Storing the new search history

     localStorage.setItem("searchHistory", JSON.stringify(arraySearchHistory));

     // Calling display history to refresh the historical search list

     displayHistory ();
  
     // Getting the weather for the new current city

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

    var global = response;
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

    console.log("City = " + currentCity);

    $("#today").empty();

    // Get icon id and remove pesky quotation marks with replace function

    var iconPng = JSON.stringify(response.list[0].weather[0].icon).replaceAll('"', '');

    console.log(iconPng);

    var iconAddress = "http://openweathermap.org/img/wn/" + iconPng + "@2x.png";

    console.log(iconAddress);

    $("#today").append($("<div>").addClass("pl-3 row align-items-center").append($("<h2>").text(currentCity + "  " + moment().format('DD/MM/YYYY') )).append($("<div>").append('<img id="WeatherIcon" src=' + iconAddress + ' />')));
  
    $("#today").append($("<p>").text("Temp: " + todayTemp + " \u00B0C"));
    $("#today").append($("<p>").text("Wind: " + todayWind + " kph"));
    $("#today").append($("<p>").text("Humidity: " + todayHumidity + "%"));

   forecast(response, numberofdays);

      }
   )
}

function forecast(response, numberofdays) {

  $("#forecast").empty();

  for(i = 0 ; response.list.length ; i++) {

    var date = response.list[i].dt_txt
    var time = moment(date).format("HH:mm:ss");

    console.log("date = " + date);
    console.log("time = " + time);

    if (time === "12:00:00")
    {
      createForecastDay(date, response, i);
    }

  }
}

function createForecastDay(date, response, i) {

  // Date

  date = moment(date).format("DD/MM/YY");

 // console.log(moment().add(i, 'days').format('DD/MM/YYYY')); - Testing moment.js formatting
  weather = JSON.stringify(response.list[i].weather[0].main);

  // Retrieve temperature and fix to degrees celcius
  temp = JSON.stringify(response.list[i].main.temp);
  temp = (+temp - 273.15);
  temp = Math.round((temp + Number.EPSILON) * 100) / 100

  // Get wind and humidity

  wind = JSON.stringify(response.list[i].wind.speed);
  humidity = JSON.stringify(response.list[i].main.humidity);

  //Get the correct weather icon

  var forecastIconPng = JSON.stringify(response.list[i].weather[0].icon).replaceAll('"', '');

  var forecastIconAddress = "http://openweathermap.org/img/wn/" + forecastIconPng + "@2x.png";

  // Use JQuery to create all the components

  const dateP = $("<h5>").text(date)
  const icon = $("<div>").append('<img id="WeatherIcon"' + i + ' src=' + forecastIconAddress + ' />');
  const tempP = $("<p>").text("Temp: " + temp + " \u00B0C");
  const windP = $("<p>").text("Wind: " + wind + " kph");
  const humidityP = $("<p>").text("Humidity: " + humidity + "%");

  // Create the containing div for each day

  const newDiv = $("<div>").addClass("rounded forecast container-fluid col-lg-2 text-center m-2 p-1 bold");
  
  // Append to the containing div

  newDiv.append(dateP);
  newDiv.append(icon);
  newDiv.append(tempP);
  newDiv.append(windP);
  newDiv.append(humidityP);

  //Append to the forecast section
  
  $("#forecast").append(newDiv);

}