# node-xing-api #


Simple module for using Xings's API in node.js


## Installation ##


`npm install node-xing-api`

## Usage ##

### Step 1: Initialization ###
```javascript
var API = require('node-xing-api');
var  = new API({
	consumerKey: 'your consumer Key',
	consumerSecret: 'your consumer secret',
	callback: 'http://yoururl.tld/something'
});
```

Optionally you can add `x_auth_access_type: "read"` or `x_auth_access_type: "write"` (see: https://dev..com/oauth/reference/post/oauth/request_token).
### Step 2: Getting a request token ###
```javascript
.getRequestToken(function(error, requestToken, requestTokenSecret, results){
	if (error) {
		console.log("Error getting OAuth request token : " + error);
	} else {
		//store token and tokenSecret somewhere, you'll need them later; redirect user
	}
});
```
If no error has occured, you now have a `requestToken` and a `requestTokenSecret`. You should store them somewhere (e.g. in a session, if you are using express), because you will need them later to get the current user's access token, which is used for authentication.

### Step 3: Getting an Access Token ###
Redirect the user to `https://.com/oauth/authenticate?oauth_token=[requestToken]`. `.getAuthUrl(requestToken, options)` also returns that URL (the options parameter is optional and may contain a boolean `force_login` and a String `screen_name` - see the  API Documentation for more information on these parameters).
If he allows your app to access his data,  will redirect him to your callback-URL (defined in Step 1) containing the get-parameters: `oauth_token` and `oauth_verifier`. You can use `oauth_token` (which is the `requestToken` in Step 2) to find the associated `requestTokenSecret`. You will need `requestToken`, `requestTokenSecret` and `oauth_verifier` to get an Access Token.
```javascript
.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
	if (error) {
		console.log(error);
	} else {
		//store accessToken and accessTokenSecret somewhere (associated to the user)
		//Step 4: Verify Credentials belongs here
	}
});
```
If no error occured, you now have an `accessToken` and an `accessTokenSecret`. You need them to authenticate later API-calls.
