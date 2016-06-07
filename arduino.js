const five = require("johnny-five")

const board = new five.Board()


module.exports = function (io) {
	board.on("ready", function () {
		var button = new five.Button(2)

		board.repl.inject({
			but: button
		})

		button.on("up", function () {
			console.log("UpValue:" + this.upValue)
			console.log("DownValue:" + this.downValue)
		})
	})

	return board
}