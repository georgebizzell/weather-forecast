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



$("#search-button").on("click", function(event) {
    event.preventDefault();

    // This line grabs the input from the textbox
    var city = $("#search-input").val().trim();
 
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
     var lat = response[0].lat;
     var lon = response[0].lon;

     console.log("Lat = " + lat);
     console.log("Lon = " + lon);

     // Storing the rating data
     var searchHistory = response[0].name;

     console.log("Search history = " + searchHistory);

     // Creating an element to have the searched city displayed
     var searchedCity = $("<li>").addClass("m-1 p-2 border-dark border rounded").text(searchHistory);

     console.log(searchedCity);

     $("#history").prepend(searchedCity);

        }
   )
}