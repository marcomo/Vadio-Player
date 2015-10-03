var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


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

