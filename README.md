# fitbit-js

Simple FitBit API client for express 3.

``` bash
npm install fitbit-js
```

## Usage

fitbit-js has two methods:

```javascript
getAccessToken(req, res, callback) // Uses oAuth module to get the access_token
apiCall(http_method, path, params, callback) // Does a call to the FitBit API.
```

`params` must contain the token.

## Test

[Register an app with fitbit](https://dev.fitbit.com/apps/new) specifying a
callback URL of `http://localhost:8553`.

```bash
npm install
cd test
node test.js [Consumer Key] [Consumer Secret]
```

open [http://localhost:8553](http://localhost:8553)
