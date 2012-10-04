var express = require('express');
var connect = require('connect');
var app = express.createServer(connect.bodyParser(),
                               connect.cookieParser('sess'));

var fitbitClient = require('../')(process.argv[2], process.argv[3]);

var token;
app.get('/', function (req, res) {
  fitbitClient.getAccessToken(req, res, function (error, newToken) {
    if(newToken) {
      token = newToken;
      res.writeHead(200, {'Content-Type':'text/html'});
      res.end('<html>Now <a href="/getStuff">get stuff</a></html>');
    }
  });
});

app.get('/getStuff', function (req, res) {
  fitbitClient.apiCall('GET', '/user/-/activities/date/2011-05-25.json',
    {token: {oauth_token_secret: token.oauth_token_secret, oauth_token: token.oauth_token}},
    function(err, resp, json) {
      if (err) return res.send(err, 500);
      res.json(json);
  });
});

app.get('/cookie', function(req, res) {
  res.send('wahoo!');
});


app.listen(8553);
console.log('listening at http://localhost:8553/');
