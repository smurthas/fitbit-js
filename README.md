# fitbit-js

Simple FitBit API client for express + connect.

    npm install fitbit-js

## Usage

fitbit-js has two methods:

* getAccessToken(_req_, _res_, _callback_): Uses oAuth module to get the access_token
* apiCall(_http_method_, _path_, _params_, _callback_): Does a call to the FitBit API.

Params must contain the token.

## Test

Enter your consumer key and secret in example/test.js

    cd test
    node test.js

open http://localhost:8553
