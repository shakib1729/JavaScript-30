const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo(){  // we are piping the video from our webcam to the webpage
	navigator.mediaDevices.getUserMedia({video: true, audio:false}) //returns a 'Promise'
	 .then(localMediaStream =>{
         video.src = window.URL.createObjectURL(localMediaStream); // in order to load a 'media' on webpage we need to provide a URL
          video.play();  // to update the video on the screen
	 })
	 .catch(err => {
	 	console.error('OH NO!!', err);
	 });
}

function paintToCanvas(){
	 // we want the size of Canvas to be as same as the dimensions of video
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {  // we take the current video frame and draw the frame to canvas every 16ms
		ctx.drawImage(video,0,0,width,height); // start from (0,0) top left to (width,height)
		// take the pixels out
		let pixels = ctx.getImageData(0,0, width, height);
		// mess with them
		//pixels = redEffects(pixels);
		pixels = redEffects(pixels);
		ctx.globalAlpha = 0.8;
		// put them back
		ctx.putImageData(pixels, 0,0);

	},16);

}

function takePhoto(){
	// play the sound
	snap.currentTime = 0;
	snap.play();

	//take the data out of the canvas
	const data = canvas.toDataURL('image/jpeg');  // gives 'base64' , a text based representation of picture
	const link = document.createElement('a'); // we are creating a new 'anchor' link
	link.href = data;
	link.setAttribute('download', 'handsome');
	link.innerHTML = `<img src="${data}" alt="Handsome Man" />`; //we create a new 'img' element to directly show the image on the webpage
	strip.insertBefore(link, strip.firstChild);  //we insert our new 'link' in the '.strip' before the first child of '.strip'
}

function redEffects(pixels){
	for(let i=0 ; i< pixels.data.length; i+=4){  //pixels.length is not an array --> pixels.data.length is the array
		pixels.data[i+0] = pixels.data[i+0] + 100;  // RED
		pixels.data[i+1] = pixels.data[i+1] - 50;   // GREEN
		pixels.data[i+2] = pixels.data[i+2] * 0.5;	  // BLUE
	}

	return pixels;
}

function rgbSplit(pixels){
	// we are just pulling apart different red, blue, green 
  for(let i=0 ; i< pixels.data.length; i+=4){  //pixels.length is not an array --> pixels.data.length is the array
		pixels.data[i-150] = pixels.data[i+0];  // RED
		pixels.data[i+500] = pixels.data[i+1];   // GREEN
		pixels.data[i-550] = pixels.data[i+2];	  // BLUE
	}
	return pixels;
}

function greenScreen(pixels){
	 const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // if any pixel is between the range take it out!
      pixels.data[i + 3] = 0; // make it completely transparent
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas); // when the 'video' element starts playing , we call painToCanvas()


//for filters --> we get the pixels out of the canvas , change the rgb value, etc and put them back in