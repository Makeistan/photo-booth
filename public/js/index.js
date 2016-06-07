var photoCanvas;
var capture;
var socket;

// images
var frame, arduinoLogo, techArt, makeistan;
var error;

var canvasText = document.getElementById("canvasText")

function preload () {
	frame = loadImage("/assets/img/wooden-frame.png")
	arduinoLogo = loadImage("/assets/img/arduino-logo.png")
	techArt = loadImage("/assets/img/tech-art.jpg")
	makeistan = loadImage("/assets/img/makeistan.png")
}

function setup () {
	photoCanvas = createCanvas(840, 640)
	photoCanvas.parent("canvasPhoto")

	capture = createCapture(VIDEO)
	capture.hide()

	socket = io()

	canvasText.addEventListener("click", function (event) {
		event.preventDefault()
	})

	socket.on("connect_error", function () {
		error = true
	})

	socket.on("connect", function () {
		error = false
	})
}

function draw () {
	if (error) {
		clear()
		background(255, 0, 0)
		fill(0)
		textSize(42)
		text("ERROR!", 50, 400)
		return;
	}

	background(0)

	image(techArt, 0, 0)
	image(capture, 20, 20, 800, 600)
	image(frame, 0, 0, 840, 640)
	image(arduinoLogo, 700, 60, 80, 60)
	image(makeistan, 610, 530, 180, 60)

	// Text of #MakeAtMakeistan
	push()
	
	stroke("#4CAF50")
	fill("#4CAF50")
	textSize(32)
	textStyle(ITALIC)
	textFont("Arial")
	text("#MakeAtMakeistan", 60, 590)

	pop()
	// End Text of #MakeAtMakeistan

	push()
	fill(255)
	stroke(255)
	textStyle(BOLD)
	textSize(32)
	text("Make-i-stan.co", 60, 90)
	pop()
}