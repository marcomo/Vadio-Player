// Problem: Need video data from Vadio
// Solution: Use node to access the Vadio Search API

// require the APIs
var http = require("http");
var queryString = require("querystring");

// Set up the API call

// Connect to the API url
var vadioAPI = "http://api.vadio.com/v0.9c/video?artist=Bruno%20Mars&title=Uptown%20Funk&country=US";
var context = "video";

// Set up the callback
var callback = function(response) {
  var body = "";
  response.on("data", function(chunk){
    body += chunk;
  });
  response.on("end", function(){
    console.dir(body);
  });
};

// Read the data from the response
var request = http.get(vadioAPI, callback);

// Handle errors from the response
request.on("error", function(error){
  console.error(error.message);
});

// End the request
request.end();