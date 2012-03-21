var express = require('express'),
    connect = require('connect'),
    app = express.createServer(connect.bodyParser(),
                               connect.cookieParser('session'),
                               connect.session());
var fs = require('fs');
var fitbitClient = require('../')('yourConsumerKey', 'yourConsumerSecret');

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
        function(err, resp) {
            res.writeHead(200, 'application/json');
            res.end(JSON.stringify(resp));
    });
    
});

app.listen(8553);
console.log('listening at http://localhost:8553/');