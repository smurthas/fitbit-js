# fitbit-js

Simple FitBit API client for express + connect.

    npm install fitbit-js

## Usage

fitbit-js has two methods:

```javascript
getAccessToken(req, res, callback) // Uses oAuth module to get the access_token
apiCall(http_method, path, params, callback) // Does a call to the FitBit API.
```

`params` must contain the token.

## Test

Enter your consumer key and secret in example/test.js

    cd test
    node test.js

open [http://localhost:8553](http://localhost:8553)
