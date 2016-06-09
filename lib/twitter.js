const Twitter = require("twitter")
const ENV = process.env

var twitterClient = new Twitter({
	consumer_key: ENV["TWITTER_CONSUMER_KEY"],
	consumer_secret: ENV["TWITTER_CONSUMER_SECRET"],
	access_token_key: ENV["TWITTER_ACCESS_TOKEN"],
	access_token_secret: ENV["TWITTER_ACCESS_TOKEN_SECRET"]
})


module.exports = twitterClient