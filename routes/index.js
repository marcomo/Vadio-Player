var express = require('express'),
        app = express(),
     router = express.Router(),
       http = require("http"),
queryString = require("querystring");

app.use(router);

// Get vadio API

var vadioAPI = "api.vadio.com",
     context = "/video",
  apiVersion = "/v0.9c"

// Requests

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/searching', function(req, res){
  var params = req.query;
  if (!params['country'])
    params['country'] = 'US';
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
