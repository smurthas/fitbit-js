# fitbit-js

Simple FitBit API client for express + connect.

    npm install oauth express serializer
    npm install fitbit-js

## Usage

fitbit-js has two methods:

```javascript
getAccessToken(req, res, callback) // Uses oAuth module to get the access_token
apiCall(http_method, path, params, callback) // Does a call to the FitBit API.
```

`params` must contain the token.

## Test

Register an App with fitbit and either specify the callbackURI or append it to the command. NB: There may be some issues specifying 127.0.0.1 or localhost as the callbackURI.

    ```cd test
    node test.js [appkey] [appsecret] [callbackURI]```

open [http://localhost:8553](http://localhost:8553)
