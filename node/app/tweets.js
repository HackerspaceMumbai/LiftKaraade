var https = require('https');
var OAuth= require('oauth').OAuth;
var keys = require('./twitterkeys');



var tweeter = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  keys.consumerKey,
  keys.consumerSecret,
  "1.0",
  null,
  "HMAC-SHA1”
);

module.exports =
[ {
  status:"test1",
  timestamp: "2011-11-5"
},{
  status:"test2",
  timestamp: "2011-11-7"
}];



var twitterer = new OAuth(
		   "https://api.twitter.com/oauth/request_token",
		   "https://api.twitter.com/oauth/access_token",
		   keys.consumerKey,
		   keys.ConsumerSecret,
		   "1.0",
		   null,
		   "HMAC-SHA1"
		  );

var tweets = require('./tweets.js');

var status = tweets[0].status;

var body = ({'status': status});

  // url, oauth_token, oauth_token_secret, post_body, post_content_type, callback

twitterer.post("http://api.twitter.com/1/statuses/update.json",
	       keys.token, keys.secret, body, "application/json",
	       function (error, data, response2) {
		   if(error){
		       console.log('Error: Something is wrong.\n'+JSON.stringify(error)+'\n');
		       for (i in response2) {
			       out = i + ' : ';
			       try {
				   out+=response2[i];
			       } catch(err) {}
			       out += '/n';
			       console.log(out);
			   }
		   }else{
		       console.log('Twitter status updated.\n');
		       console.log(response2+'\n');
		   }
	       });