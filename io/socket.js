var socketIO = require("socket.io")

module.exports = function (server) {
	var io = socketIO(server)

	io.button = function (data) {
		io.emit("button", data)
	}

	return io
}