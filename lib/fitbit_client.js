/*
 * Fitbit-js
 *
 * Copyright (c) 2011 Simon Murtha-Smith <simon@murtha-smith.com>
 */

var url = require('url');
var http = require('http');
var OAuth = require('oauth').OAuth;
var querystring = require('querystring');
var Serializer = require('serializer');

var baseURI = 'http://api.fitbit.com/1';

module.exports = function (api_key, api_secret, callbackURI) {
    var client = {version: '0.1.0'};
    var serializer = Serializer.createSecureSerializer(api_key, api_secret);

    var oAuth = new OAuth('http://api.fitbit.com/oauth/request_token',
                          'http://api.fitbit.com/oauth/access_token',
                          api_key, api_secret, '1.0', callbackURI,
                          'HMAC-SHA1', null,
        {'Accept': '*/*', 'Connection': 'close', 'User-Agent': 'fitbit-js ' + client.version});


    function requestCallback(callback) {
      return function (err, data, response) {
        if (err) return callback(err, data);
        var exception = null;
        try {
          data = JSON.parse(data);
        } catch (e) { exception = e; }
        callback(exception, response, data);
      };
    }

    function get(path, params, token, callback) {
      oAuth.get(baseURI + path + '?' + querystring.stringify(params),
                token.oauth_token, token.oauth_token_secret, requestCallback(callback));
    }

    function post(path, params, token, callback) {
      oAuth.post(baseURI + path, token.oauth_token, token.oauth_token_secret,
                 params, null, requestCallback(callback));
    }

    // PUBLIC
    client.apiCall = function (method, path, params, callback) {
      var token = params.token;
      delete params.token;
      if (method === 'GET') get(path, params, token, callback);
      else if (method === 'POST') post(path, params, token, callback);
    }

    client.getAccessToken = function (req, res, callback) {
      var sess;
      if(req.cookies && req.cookies.fitbit_client) {
        try { sess = serializer.parse(req.cookies.fitbit_client) }catch(E){ }
      }
      var qs = url.parse(req.url, true).query;

      var has_token = qs && qs.oauth_token,
          has_secret = sess && sess.token_secret;

      if(has_token &&  has_secret) { // Access token
        oAuth.getOAuthAccessToken(qs.oauth_token,
                                  sess.tokenSecret,
                                  qs.oauth_verifier,
        function (error, oauth_token, oauth_token_secret, additionalParameters) {
          if (error) return callback(error, null);
          callback(null, {oauth_token: oauth_token, oauth_token_secret: oauth_token_secret});
        });
      } else { // Request token
        oAuth.getOAuthRequestToken({oauth_callback: callbackURI},
          function (error, oauth_token, oauth_token_secret, oauth_authorize_url, additionalParameters) {
          if (error) return callback(error, null);
          res.cookie('fitbit_client',
            serializer.stringify({token_secret:oauth_token_secret}),
            { path: '/', httpOnly: false }); // stash the secret
          res.redirect('http://www.fitbit.com/oauth/authorize?oauth_token=' + oauth_token);
        });
      }
  };

  return client;
};
