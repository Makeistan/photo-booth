const express = require("express")
const http = require("http")
const path = require("path")
const fs = require("fs")
const morgan = require("morgan")
const colors = require("colors/safe")

const NODE_ENV = process.env.NODE_ENV || "development"


const app = express()

const server = http.createServer(app)


const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "0.0.0.0"


const locals = app.locals
locals.config = JSON.parse(fs.readFileSync("./config.json"))

if (NODE_ENV == "development") {
	locals.pretty = true
	require("./keys")
	app.use(morgan("dev", {}))
}
else {
	app.use(morgan("combined", {}))
}

const io = require("./io/socket")(server)
// const board = require("./arduino")(io)


app.set("view engine", "pug")
app.set("views", path.join(__dirname , "views"))

app.use(express.static(path.join(__dirname, "public")))

app.get("/", function (req, res, next) {
	res.render('index', {
		title: locals.config.boothName
	})
})

server.listen(PORT, HOST, function (error) {
	if (!error) {
		console.log(`Server is listening on ${HOST}:${PORT}`)
	}
	else {
		console.error(error)
	}
})