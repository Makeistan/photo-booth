var photoCanvas;
var capture;
var socket;

// tracks the progress of the picture
// if the picture being taken is in progress and requires approval it's true
var pictureProgress;

// images
var frame,
	arduinoLogo, 	
	techArt, 
	makeistan, truckArt, 
	piLogo, nodebotsLogo;

var error;
var blobPicture;

var takePictureBtn = document.getElementById("takePictureBtn")
var savePictureBtn = document.getElementById("savePictureBtn")

var photoModal = $("#photoModal")
var loaderModal = $("#loaderModal")

var parentCanvas = $("#canvasPhoto")

function preload () {
	var assetsDirectory = "/assets/img/"

	frame = loadImage(assetsDirectory +  "wooden-frame.png")
	arduinoLogo = loadImage(assetsDirectory + "arduino-logo.png")
	makeistan = loadImage(assetsDirectory + "makeistan.png")
	piLogo = loadImage(assetsDirectory + "raspberry-pi-logo.png")
	nodebotsLogo = loadImage(assetsDirectory + "nodebots-logo.png")
	truckArt = loadImage(assetsDirectory + "truck-art.jpg")
}

function setup () {
	photoCanvas = createCanvas(840, 640)
	photoCanvas.parent("canvasPhoto")

	capture = createCapture(VIDEO)
	capture.hide()

	socket = io()

	socket.on("connect_error", function () {
		error = true
	})

	socket.on("connect", function () {
		error = false
	})

	socket.on("shot", function () {
		if (pictureProgress) {
			return;
		}
		
		var shotTime = 2 * 2000
		Materialize.toast("<span class='animated pulse infinite'>SHOTTT!!!!!</span>", shotTime)
		console.log("Trying to shoot an image!")

		takeAPicture()
	})

	socket.on("successTweet", function (data) {
		var toastTime = 5000
		var toastContent = 
			$("<span></span>")
				.addClass("green-text")
				.html("Success in publishing <a class='blue-text' href='" + data.link + "'>tweet</a>")

		Materialize.toast(toastContent, 5000)
	})

	takePictureBtn.addEventListener("click", function (event) {
		takeAPicture()
	})

	savePictureBtn.addEventListener("click", function (event) {
		tadaCanvas(function () {
			saveCanvas(photoCanvas, "photobooth-pic", "jpg")			
		})
	})
}

function draw () {
	if (error) {
		clear()
		background(255, 0, 0)
		fill(0)
		textSize(30)
		text("ERROR!", 50, 400)
		text("Establish a connection with Socket.io server to start it!", 50, 460)
		fill(0, 255, 255)
		text("Click anywhere in canvas to go to Makeistan's Fb Page", 50, 520)
		return;

	}

	background(0)

	image(truckArt, 0, 0)
	image(capture, 20, 20, 800, 600)
	image(frame, 0, 0, 840, 640)
	image(arduinoLogo, 700, 60, 80, 60)
	image(nodebotsLogo, 715, 130, 60, 60)
	image(piLogo, 625, 60, 60, 80)
	image(makeistan, 590, 530, 200, 60)

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

function mousePressed () {
	if (error && (mouseX >= 0 && mouseX <= 840) && (mouseY >= 0 && mouseY <= 640)) {
		window.open("https://facebook.com/makeistan")
	}
}

$(document).ready(function () {
	$(".materialboxed").materialbox();
	$(".tooltipped").tooltip({
		delay: 50
	})
})

// flashes the camera every time
function flashCanvas (callback) {
	parentCanvas.addClass("animated fadeIn")

	parentCanvas.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
		parentCanvas.removeClass("animated fadeIn")
		callback()
	})
}

function tadaCanvas(callback) {
	var parentCanvas = $("#canvasPhoto")

	parentCanvas.addClass("animated tada")

	parentCanvas.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
		parentCanvas.removeClass("animated tada")
		callback()
	})
}

function takeAPicture () {
	if (pictureProgress) {
			console.info("One picture is still in approval process!")
			return
		}

		loaderModal.closeModal()
		flashCanvas(function () {
			loaderModal.openModal()
			
			photoCanvas.elt.toBlob(function (blob) {
				if (blob) {
					changePhotoModal(blob)
					loaderModal.closeModal()
					photoModal.openModal({
						opacity: 1,
						ready: function () {
							pictureProgress = true
						},
						complete: function () {
							pictureProgress = false
						}
					})
				}
			}, 'image/jpeg', 1)
		})
}


// change the photoModal for the given image
function changePhotoModal (blob) {
	var picTag = $("#testPic")
	var titleInput = $("#modalTitleInput")
	var sendButtons = $("#photoModal").find(".sendPictureButtons")

	var imgUrl = URL.createObjectURL(blob)
	picTag.attr("src", imgUrl)
	
	sendButtons.off()
	sendButtons.on("click", function (event) {
		event.preventDefault();
		
		titleInput.val("")		
		socket.emit("imageBlob", {
			image: true,
			blob: blob,
			type: blob.type,
			title: titleInput.val()
		})
		photoModal.closeModal()

	})
}