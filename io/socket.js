const fs = require("fs")
const socketIO = require("socket.io")
const path = require("path")
const colors = require("colors/safe")

const twitterClient = require("../lib/twitter")
const imgur = require("imgur")

const mkdirp = require("mkdirp")


var imageDirectory = "./images/"

mkdirp.sync(imageDirectory)

// setting credentials for imgur
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

module.exports = function (server, redisClient) {
	var io = socketIO(server)

	io.shot = function () {
		this.emit("shot")
	}

	io.on("connection", function (socket) {
		socket.on("imageBlob", function (payload) {
			var screenName = payload.title
			
			twitterClient.post("media/upload", {
				media: payload.blob
			}, function (error, media) {
				if (error) {
					console.error(error)
					socket.emit("failTweet", {
						error: error.toString()
					})
				}
				else if (media) {
					// var status = "Awesome people who #MakeAtMakeistan #ArduinoNight #MakerMovement #Pakistan"
					status = "Yo it's secret!"

					if (screenName) {
						status += ` ${screenName.trim().indexOf("@") == 0 ? "" : "@"}${screenName}`
					}

					twitterClient.post("statuses/update", {
						status: status,
						media_ids: media.media_id_string
					}, function (error, tweet) {
						if (error) {
							socket.emit("failTweet", {
								error: error.toString()
							})
							console.error(error)
						}
						else if (tweet) {
							socket.emit("successTweet", {
								link: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
								text: tweet.text || "No tweet text available!"
							})
							console.log(colors.green("tweet has been posted!"))
							// console.log(tweet)
						}
					})
				}
			})
		})
	})

	setInterval(function () {
		io.shot()
	}, (Math.ceil(Math.random() * 6000) + 1000))

	return io
}