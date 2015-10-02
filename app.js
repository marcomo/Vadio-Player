// Problem: Need video data from Vadio
// Solution: Use node to access the Vadio Search API

// require the APIs
var http = require("http");
var queryString = require("querystring");

// Set up a server

// Setup port
const PORT = 8080;

// Function which handles requests and responses
function handleRequest(request, response){
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<!DOCTYPE 'html'>");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>Hello World Page</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("<h1>Hello World!</h1>");
  response.write("</body>");
  response.write("</html>");
  response.end();
}

// Create a server
var server = http.createServer(handleRequest);

// Start server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening
    console.log("Server listening on: http://localhost:%s", PORT);
});

// Set up the API call

// Connect to the API url
var vadioAPI = "api.vadio.com";
var context = "video";

var vadioOptions = {
  artist: "Bruno Mars",
  title: "Uptown Funk",
  country: "US"
};

var query = "/v0.9c/" + context + "?" + queryString.stringify(vadioOptions);

var requestOptions = {
  host: vadioAPI,
  path: query
};

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
var request = http.get(requestOptions, callback);

// Handle errors from the response
request.on("error", function(error){
  console.error(error.message);
});

// End the request
request.end();