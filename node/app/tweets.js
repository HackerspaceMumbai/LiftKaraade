var https = require('https');
var OAuth= require('oauth').OAuth;
var keys = require('./twitterkeys');

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
	consumerKey: keys.consumerKey,
	consumerSecret: keys.consumerSecret,
	callback: null
});


exports.getUserName = function(oauth,cb){
	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
		if (error) {
			console.log("Error getting OAuth request token : " + error);
		} else {
			twitter.verifyCredentials(oauth.authtoken, oauth.authsecret, function(error, data, response) {
				console.log(error)
				if (!error) {
					cb(null,data);
				} else {
					cb(error,data);
				}
			});
		}
	});
}

exports.postUpdate = function(oauth,body,cb){
	twitter.oa.post("https://api.twitter.com/1/statuses/update.json",
		oauth.authtoken,oauth.authsecret, {status:"boady"}, "application/json",
		function (error, data, response) {
			if (error) {
				cb(error);
			} else {
				console.log('Twitter status updated.\n');
				console.log(response+'\n')		}	
				cd(null,response);
			});
};	

