import React, { useState, useRef, useEffect } from "react";


const Exporter = () => {

    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);

    const [ canvasVideo, setcanvasVideo] = useState(null);
    const [recording, setRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [downloadLink, setdownloadLink] = useState(null);

    const [image2Canvas, setimage2Canvas] = useState("./1.JPG");

    const [scenes, setscenes] = useState([{
                              sentence: "A place full of misty clouds\nand text collages everywhere",
                              src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F1793-1794_alberto-baez.jpg?alt=media&token=7cbf5408-6b30-4b80-8b1b-d852c8f2680b",
                              anim: 'zoom-in',
                              duration: 1000
                              },
                              {
                              sentence: "A chalk-white stone in a dark\nand untidy cyclorama",
                              src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F95avgz%40gmail.comNegativo%20de%20un%20Abrazo%201.jpg?alt=media&token=03a15c60-0b8a-4e6c-b993-dc684fa08e57",
                              anim: 'zoom-in',
                              duration: 1000
                              },
                              {
                              sentence: "A rose painted in oil style,\nreminiscent of Frida Kahlo's\nearly works,on a\nyellow background.",
                              src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2FAnthurium%20andreadnum%202022%20o%CC%81leo%20sobre%20lienzo%2030%20x%2030%20cm%20Tanya%20Huntington.jpg?alt=media&token=2c8a7bdf-00f8-4913-be51-43cd2a2bd7a8",
                              anim: 'zoom-in',
                              duration: 1000
                              },
                              {
                              sentence: "An abstract jungle full of\nstrange characters, everything\nfeels strangely alive.",
                              src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F23_3.jpg?alt=media&token=e4628d95-35c2-4ada-8525-55ce9d0d0867",
                              anim: 'zoom-in',
                              duration: 1000
                              }
                              ]);  

    useEffect(() => {
        
        setcanvasVideo(canvasRef.current);


      }, []);

      useEffect(() => {
        const videoElement = videoRef.current;
    
        const playVideoIfVisible = () => {
          const videoRect = videoElement.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
          // Check if the video is at least partially visible
          if (videoRect.top < windowHeight && videoRect.bottom >= 0) {
            videoElement.play();
            window.removeEventListener('scroll', playVideoIfVisible);
          }
        };
    
        window.addEventListener('scroll', playVideoIfVisible);
    
        return () => {
          window.removeEventListener('scroll', playVideoIfVisible);
        };
      }, []);


      const downloadVideo = () => {
        const url = URL.createObjectURL(downloadLink);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'canvas-video.webm';
        link.click();
      };

      const startRecording = () => {

        const stream = canvasVideo.captureStream(); // Capture video stream from canvas
        const chunks = [];
    
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          setVideoBlob(URL.createObjectURL(blob));
          setdownloadLink(blob);
        };
        mediaRecorder.start();
        setRecording(true);
        mediaRecorderRef.current = mediaRecorder;
      };
    
      const stopRecording = () => {
        const mediaRecorder = mediaRecorderRef.current;
        mediaRecorder.stop();
        setRecording(false);
      };


      function drawImagesPeriodically(images) {

        let currentIndex = 0;
        const ctx = canvasVideo.getContext('2d');    
        let intervalId = null;
        let alpha = 0; // The opacity of the current image
        let durationImageScene = 2.2; // Set a value in between (1 and 2) for the duration of each image here
        let fps = 16; // Set the desired FPS for the animation here, 16 is assuming a 60fps refresh rate
        let prevIndex = 0;
        let zoom = 1; // Zoom factor for the zoom-in effect
        let zoomPlus = 1.3; // Zoom factor for the initial position in zoom-out effect
        let currentZoom = zoom += 0.001;

        switch (images[currentIndex].anim) {
        
        case 'zoom-in':

        function startDrawing() {
          // Start the animation loop
          intervalId = setInterval(draw, fps); 
        }
      
        function stopDrawing() {
          // Stop the animation loop
          clearInterval(intervalId);
        }

      
        function draw() {
        // Clear the canvas before drawing the next frame
        ctx.clearRect(0, 0, canvasVideo.width, canvasVideo.height);

        if (currentIndex === 0) {
          // Draw the current image, with a fading effect
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(
            images[currentIndex].img,
            -((zoom - 1) * canvasVideo.width) / 2,
            -((zoom - 1) * canvasVideo.height) / 2,
            canvasVideo.width * zoom,
            canvasVideo.height * zoom
          );
          ctx.restore();
          alpha += 0.001;
        } else {
          // Draw the previous image, fully opaque
          prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
/*           ctx.drawImage(
            images[prevIndex].img,
            2,
            2,
            canvasVideo.width,
            canvasVideo.height
          ); */
        
          // Draw the current image, with a fading effect
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(
            images[currentIndex].img,
            -((zoom - 1) * canvasVideo.width) / 2,
            -((zoom - 1) * canvasVideo.height) / 2,
            canvasVideo.width * zoom,
            canvasVideo.height * zoom
          );
          ctx.restore();
        }
      
        const yellowBoxWidth = (canvasVideo.width * 1.2) / 2;
        const yellowBoxHeight = 85;
        const yellowBoxX = (canvasVideo.width - yellowBoxWidth) / 2;
        const yellowBoxY = canvasVideo.height - (canvasVideo.height * 0.1) - yellowBoxHeight;
      
        // Draw the yellow background
        ctx.fillStyle = 'yellow';
        ctx.fillRect(yellowBoxX, yellowBoxY, yellowBoxWidth, yellowBoxHeight);
      
        // Draw the black border around the yellow background
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeRect(yellowBoxX + 1, yellowBoxY, yellowBoxWidth - 2, yellowBoxHeight);
      
        // Split the text into lines based on line breaks
        const textLines = images[currentIndex].sentence.split('\n');
      
        // Calculate the vertical position to center the text within the yellow background
        const lineHeight = 16;
        const textY = yellowBoxY + (yellowBoxHeight - textLines.length * lineHeight) / 2 + lineHeight;
      
        // Draw the text with line breaks
        ctx.fillStyle = 'black';
        ctx.font = '14px courier';
        ctx.textAlign = 'center';
      
        textLines.forEach((line, index) => {
          ctx.fillText(line, yellowBoxX + yellowBoxWidth / 2, textY + index * lineHeight);
        });

                // Increment the alpha value for the current image
          alpha += 0.01;
          // Increment the zoom value for the current image
          zoom += 0.001;

          if (alpha > durationImageScene) {
            // Reset the alpha value and move on to the next image
            alpha = 0;
            zoom = 1;
            currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        
            if (currentIndex === 0) {
              // Stop the animation loop if we've reached the final image
              clearInterval(intervalId);
              stopRecording();
              return;
            }
          }
        }
         
        if (images.length < 2) {
          alert('Please add more than one image!');
        } else {
          startDrawing();
        }
      
        return stopDrawing;


        case 'zoom-out':
       
        function startDrawingOut() {
          // Start the animation loop
          intervalId = setInterval(drawOut, fps); 
        }
      
        function stopDrawingOut() {
          // Stop the animation loop
          clearInterval(intervalId);
        }
  
        function drawOut() {
        // Clear the canvas before drawing the next frame
        ctx.clearRect(0, 0, canvasVideo.width, canvasVideo.height);

        if (currentIndex === 0) {
          // Draw the current image, with a fading effect
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(
            images[currentIndex].img,
            -((zoomPlus - 1) * canvasVideo.width) / 2,
            -((zoomPlus - 1) * canvasVideo.height) / 2,
            canvasVideo.width * zoomPlus,
            canvasVideo.height * zoomPlus
          );
          ctx.restore();
          alpha += 0.001;
        } else {
          // Draw the previous image, fully opaque
          prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
/*           ctx.drawImage(
            images[prevIndex].img,
            2,
            2,
            canvasVideo.width,
            canvasVideo.height
          ); */
        
          // Draw the current image, with a fading effect
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(
            images[currentIndex].img,
            -((zoomPlus - 1) * canvasVideo.width) / 2,
            -((zoomPlus - 1) * canvasVideo.height) / 2,
            canvasVideo.width * zoomPlus,
            canvasVideo.height * zoomPlus
          );
          ctx.restore();
        }
      
        const yellowBoxWidth = (canvasVideo.width * 1.2) / 2;
        const yellowBoxHeight = 85;
        const yellowBoxX = (canvasVideo.width - yellowBoxWidth) / 2;
        const yellowBoxY = canvasVideo.height - (canvasVideo.height * 0.1) - yellowBoxHeight;
      
        // Draw the yellow background
        ctx.fillStyle = 'yellow';
        ctx.fillRect(yellowBoxX, yellowBoxY, yellowBoxWidth, yellowBoxHeight);
      
        // Draw the black border around the yellow background
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeRect(yellowBoxX + 1, yellowBoxY, yellowBoxWidth - 2, yellowBoxHeight);
      
        // Split the text into lines based on line breaks
        const textLines = images[currentIndex].sentence.split('\n');
      
        // Calculate the vertical position to center the text within the yellow background
        const lineHeight = 16;
        const textY = yellowBoxY + (yellowBoxHeight - textLines.length * lineHeight) / 2 + lineHeight;
      
        // Draw the text with line breaks
        ctx.fillStyle = 'black';
        ctx.font = '14px courier';
        ctx.textAlign = 'center';
      
        textLines.forEach((line, index) => {
          ctx.fillText(line, yellowBoxX + yellowBoxWidth / 2, textY + index * lineHeight);
        });

                // Increment the alpha value for the current image
          alpha += 0.01;
          // Increment the zoomPlus value for the current image
          zoomPlus -= 0.001;

          if (alpha > durationImageScene) {
            // Reset the alpha value and move on to the next image
            alpha = 0;
            zoomPlus = 1.3;
            currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        
            if (currentIndex === 0) {
              // Stop the animation loop if we've reached the final image
              clearInterval(intervalId);
              stopRecording();
              return;
            }
          }
        }
         
        if (images.length < 2) {
          alert('Please add more than one image!');
        } else {
          startDrawingOut();
        }
      
        return stopDrawingOut;

      }
      }

/*       function handleFileInputChange(event) {

        const files = event.target.files;
      
        // Convert the FileList to an array of Image objects
        const images = Array.from(files).map((file, i) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          const text = prompt(`Image ${i + 1}: Enter the text to be displayed on the canvas`);
          return { img, text };
        });
      
        // Draw the images periodically in the canvas
        const stopDrawing = drawImagesPeriodically(images);
      
        startRecording();
      
        // Clean up the interval when the component unmounts or when the images change
        return () => {
          stopDrawing();
        };
      }  */

      async function loadImageFromUrl(url, sentence, anim) {
        return fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            return { img, sentence, anim };
          });
      }

      function handleScenes(arrayScenes) {

        const promises = arrayScenes.map((scene, i) => {
          const text = scene.sentence;
          return loadImageFromUrl(scene.src, text, scene.anim);
        });
        
        Promise.all(promises).then((images) => {
          // Draw the images periodically in the canvas
          const stopDrawing = drawImagesPeriodically(images);
        
          startRecording();

          console.log("Images from new", images)
        
        // Clean up the interval when the component unmounts or when the images change
       return () => {
            stopDrawing();
          }; 
        });
      }


    return (
      <>
      <div className="flex flex-col"></div>
      
      <canvas className="bg-white mx-auto mt-8" ref={canvasRef} width={512} height={512} />
      {!recording && <h1 className="w-full text-center font-bold text-2xl pt-6">Click start to add an array of scenes and start recording</h1>}
      
      {!recording && 
      <>
      <div className="flex flex-row p-3 justify-center gap-8">
      <button className="w-2/12 mt-4  py-2  bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      
      onClick={
        ()=>{
          setscenes([{
            sentence: "A place full of misty clouds\nand text collages everywhere",
            src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F1793-1794_alberto-baez.jpg?alt=media&token=7cbf5408-6b30-4b80-8b1b-d852c8f2680b",
            anim: 'zoom-in',
            duration: 1000
            },
            {
            sentence: "A chalk-white stone in a dark\nand untidy cyclorama",
            src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F95avgz%40gmail.comNegativo%20de%20un%20Abrazo%201.jpg?alt=media&token=03a15c60-0b8a-4e6c-b993-dc684fa08e57",
            anim: 'zoom-in',
            duration: 1000
            },
            {
            sentence: "A rose painted in oil style,\nreminiscent of Frida Kahlo's\nearly works,on a\nyellow background.",
            src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2FAnthurium%20andreadnum%202022%20o%CC%81leo%20sobre%20lienzo%2030%20x%2030%20cm%20Tanya%20Huntington.jpg?alt=media&token=2c8a7bdf-00f8-4913-be51-43cd2a2bd7a8",
            anim: 'zoom-in',
            duration: 1000
            },
            {
            sentence: "An abstract jungle full of\nstrange characters, everything\nfeels strangely alive.",
            src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F23_3.jpg?alt=media&token=e4628d95-35c2-4ada-8525-55ce9d0d0867",
            anim: 'zoom-in',
            duration: 1000
            }
            ])

            console.log("scenes", scenes)
        
        }
        }>Change to Zoom-in</button>
      <button className="w-2/12 mt-4  py-2  bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      onClick={()=>{
        
        setscenes([{
          sentence: "A place full of misty clouds\nand text collages everywhere",
          src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F1793-1794_alberto-baez.jpg?alt=media&token=7cbf5408-6b30-4b80-8b1b-d852c8f2680b",
          anim: 'zoom-out',
          duration: 1000
          },
          {
          sentence: "A chalk-white stone in a dark\nand untidy cyclorama",
          src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F95avgz%40gmail.comNegativo%20de%20un%20Abrazo%201.jpg?alt=media&token=03a15c60-0b8a-4e6c-b993-dc684fa08e57",
          anim: 'zoom-out',
          duration: 1000
          },
          {
          sentence: "A rose painted in oil style,\nreminiscent of Frida Kahlo's\nearly works,on a\nyellow background.",
          src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2FAnthurium%20andreadnum%202022%20o%CC%81leo%20sobre%20lienzo%2030%20x%2030%20cm%20Tanya%20Huntington.jpg?alt=media&token=2c8a7bdf-00f8-4913-be51-43cd2a2bd7a8",
          anim: 'zoom-out',
          duration: 1000
          },
          {
          sentence: "An abstract jungle full of\nstrange characters, everything\nfeels strangely alive.",
          src: "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/artworks%2F23_3.jpg?alt=media&token=e4628d95-35c2-4ada-8525-55ce9d0d0867",
          anim: 'zoom-out',
          duration: 1000
          }
          ])

          console.log("scenes", scenes)
      }
      
      
      }>Change to Zoom-out</button>
      </div>

      <button className="w-2/12 mt-4  mx-auto py-2  bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      onClick={()=>{
        handleScenes(scenes)
      }
      
      
      }>Start</button>
      </>
      
      }

      {recording && <button className="w-1/12 mt-4  mx-auto py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={stopRecording}>Stop Recording</button>}

      <video
      className="w-4/12 mt-4 mx-auto py-2 px-4"
      ref={videoRef}
      autoPlay
      muted
      loop
      controls
      src={videoBlob}
      />
      
      {videoBlob && <button className="w-1/12 mt-4  mx-auto py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={downloadVideo}>Download Video</button>}

      </>
      
    );


};

export default Exporter;