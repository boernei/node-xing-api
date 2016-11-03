"use strict";
var VERSION = "1.0.0",
	querystring = require("querystring"),
	oauth = require("oauth"),
	request = require("request"),
	fs = require("fs");

var baseUrl = "https://api.xing.com/v1/";
var authUrl = "https://api.xing.com/v1/authorize?oauth_token=";


var Xing = function(options) {
	if (!(this instanceof Xing))
		return new Xing(options);

	this.consumerKey = options.consumerKey;
	this.consumerSecret = options.consumerSecret;
	this.callback = options.callback;

	this.x_auth_access_type = options.x_auth_access_type;

	this.oa = new oauth.OAuth("https://api.xing.com/v1/request_token", "https://api.xing.com/v1/access_token",
		this.consumerKey, this.consumerSecret, "1.0", this.callback, "HMAC-SHA1");

	return this;
};
Xing.VERSION = VERSION;

Xing.prototype.getRequestToken = function(callback) {
	this.oa.getOAuthRequestToken({x_auth_access_type: this.x_auth_access_type}, function(error, oauthToken, oauthTokenSecret, results) {
		if (error) {
			callback(error);
		} else {
			callback(null, oauthToken, oauthTokenSecret, results);
		}
	});
};

Xing.prototype.getAuthUrl = function(requestToken, options) {
	var extraArgs = "";
	if (options && options.force_login) {
		extraArgs += "&force_login=1";
	}
	if (options && options.screen_name) {
		extraArgs += "&screen_name=" + options.screen_name;
	}
	return authUrl + requestToken + extraArgs;
};

Xing.prototype.getAccessToken = function(requestToken, requestTokenSecret, oauth_verifier, callback) {
	this.oa.getOAuthAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
		if (error) {
			callback(error);
		} else {
			callback(null, oauthAccessToken, oauthAccessTokenSecret, results);
		}
	});
};

Xing.prototype.verifyCredentials = function(accessToken, accessTokenSecret, params, callback) {
	var url = baseUrl + "account/verify_credentials.json";
	if (typeof params == "function") {
		callback = params;
	} else {
		url += '?' + querystring.stringify(params);
	}
	this.oa.get(url, accessToken, accessTokenSecret, function(error, data, response) {
		if (error) {
			callback(error);
		} else {
			try {
				var parsedData = JSON.parse(data);
			} catch (e) {
				callback(e, data, response);
			}
			callback(null, parsedData, response);
		}
	});
};

Xing.prototype.performCall = function(url,params,accessToken,accessTokenSecret,callback) {
		
		this.oa.get(baseUrl + url + ".json?" + querystring.stringify(params), accessToken, accessTokenSecret, function(error, data, response) {
		if (error) {
			callback(error);
		} else {
			try {
				var parsedData = JSON.parse(data);
			} catch (e) {
				callback(e, data, response);
			}
			callback(null, parsedData, response);
		}
	});
}

module.exports = Xing;
