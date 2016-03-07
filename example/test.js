var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser('sess'));

var PORT = process.argv[5] || 8553;

var fitbitClient = require('../')(process.argv[2], process.argv[3],
                                  'http://localhost:' + PORT, process.argv[4]);

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
  fitbitClient.apiCall('GET', '/user/-/profile.json',
    {token: {oauth_token_secret: token.oauth_token_secret,
             oauth_token: token.oauth_token}},
    function(err, resp, json) {
      if (err) return res.send(err, 500);
      res.json(json);
  });
});

app.get('/cookie', function(req, res) {
  res.send('wahoo!');
});


app.listen(PORT);
console.log('listening at http://localhost:' + PORT + '/');
