var express = require('express'),
        app = express(),
     router = express.Router(),
       http = require("http"),
queryString = require("querystring");

app.use(router);


// Vadio API variables
var vadioAPI = "api.vadio.com",
     context = "/video",
  apiVersion = "/v0.9c"



// Requests

// Main page route which loads the form and playlists
router.get('/', function(req, res) {
  res.render('index');
});

// Route for AJAX request from client
// Hands of to getVadio() which has a route
// to the endpoint
router.get('/searching', function(req, res){
  var params = req.query;
  if (!params['country']) {
    params['country'] = 'US';
  } else {
    params['country'] = params['country'].toUpperCase();
  }

  getVadio(params, function(data){
    res.send(data);
  });
});

// request to vadio API

function getVadio(params, cb) {
  var query = queryString.stringify(params);

  var vadioOptions = {
    host: vadioAPI,
    path: apiVersion + context + "?" + query
  };

  return http.get(vadioOptions, function(response){
    var body = "";
    response.on('data', function (chunk) {
      body += chunk;
    });
    
    response.on('end', function () {
      var data = JSON.parse(body);
      console.log(response.req.path);
      cb(data);
    });

    response.on('error', function(error){
      var msg = error.message;
      console.error(msg);
      cb(msg);
    });
  });  
}

module.exports = router;
