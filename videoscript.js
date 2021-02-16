//sorry about the messy code

//configs
var framerate = 5; //frames per second
var videopath = 'C:/Users/bobma/Desktop/videothing/endofworld.mp4'; //complete file path of the video
var isColored = true; //is the final text colored? (true/false)
var renderSpeed = 1500; //time, in ms, allotted to rendering each frame

/*
IMPORTANT NOTES:
1. Don't set the framerate over 10 unless you have a beast computer.
2. Replace all \ slashes in the filepath with / slashes
3. The slower the rendering speed per frame is, the less buggy and spazzy it'll look.
4. I STRONGLY suggest not setting the render speed per frame to below 1000 (1 sec) unless your computer is really good. Recommended is 1000-2000.
5. Be sure to record this and speed it up until it matches the speed of the actual video you're rendering, since this renders it in slowmode.
6. See errors? Follow the instructions in the readme.
*/


//you don't need to mess with the stuff below
//split video into frames
var ffmpeg = require('ffmpeg');
const imageToAscii = require('image-to-ascii');

try {
	var process = new ffmpeg(videopath);
	process.then(function(video) {
    console.log("Loading...");
		video.fnExtractFrameToJPG('./frames', {
			frame_rate: framerate,
			file_name: 'frame%i'
		}, function (error, files) {
			if(!error) {
        //search for frames
        const searchfolder = './frames';
        const fs = require('fs');
        var filecounter = 0;

        fs.readdir(searchfolder, (err, files) => {
          files.forEach(file => {
            filecounter++;
          });

          //when frames are found, render them
          console.log("Located " + filecounter + " frames.");
          async function render() {
            function sleep(ms) {
              return new Promise((resolve) => {
                setTimeout(resolve, ms);
              });
            }
            var i;
            for (i = 1; i < filecounter; i++) {
              await sleep(renderSpeed);
              var imagetoparse = "./frames/frame_" + i + ".jpg";
              imageToAscii(imagetoparse, {
                colored: isColored,
                pxWidth: 5,
                bg: false
              }, (err, converted) => {
                  console.log(err || converted);
              });
            }
          }
          render();
        });
      }
		});
	}, function(err) {
		console.log('Error: ' + err);
	});
} catch(e) {
	console.log(e.code);
	console.log(e.msg);
}
