import React, { useState, useRef, useEffect } from "react";


const Exporter = () => {

    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const [ canvasVideo, setcanvasVideo] = useState(null);
    const [recording, setRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);

    const [image2Canvas, setimage2Canvas] = useState("./1.JPG");
    

    useEffect(() => {
        
        setcanvasVideo(canvasRef.current);


      }, []);


    function drawOnCanvas(canvasInput) {
        
        // Get the canvas element and its 2D rendering context
        const ctx = canvasInput.getContext('2d');
      
        const image = new Image();
        image.src = image2Canvas; // Replace with the URL or path of your image file
        image.onload = () => {
          ctx.drawImage(image, 0, 0); // Draw the image at position (0, 0) in the canvas
        };

        //downloadCanvas(canvasInput);
      }

      const downloadVideo = () => {
        const url = URL.createObjectURL(videoBlob);
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
          setVideoBlob(blob);
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
        const ctx = canvasVideo.getContext('2d');
        let currentIndex = 0;
        let intervalId = null;
        let alpha = 0; // The opacity of the current image
        let durationImageScene = 1.5; //Set a value in between (1 and 2) for the duration of each image here
        let fps = 16; // Set the desired FPS for the animation here, 16 is assuming a 60fps refresh rate
        let prevIndex = 0;
      
        function draw() {
          // Clear the canvas before drawing the next frame
          ctx.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
        
          // Draw the previous image, fully opaque
          if(currentIndex !== 0){
            prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
          }
          ctx.drawImage(images[prevIndex].img, 0, 0, canvasVideo.width, canvasVideo.height);
        
          // Draw the current image, with a fading effect
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(images[currentIndex].img, 0, 0, canvasVideo.width, canvasVideo.height);
          ctx.restore();
        
          // Draw the text box with custom text on the bottom of the canvas
          ctx.fillStyle = 'yellow';
          ctx.fillRect(0, canvasVideo.height - 50, canvasVideo.width, 50);
          ctx.fillStyle = 'black';
          ctx.font = 'bold 30px courier';
          ctx.textAlign = 'center'; // Add this line to center the text
          ctx.fillText(images[currentIndex].text, canvasVideo.width / 2, canvasVideo.height - 18);
        
          // Draw a black border around the text box
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 3;
          ctx.strokeRect(1, canvasVideo.height - 49, canvasVideo.width - 2, 48);
        
          // Increment the alpha value for the current image
          alpha += 0.01;
          if (alpha > durationImageScene) {
            // Reset the alpha value and move on to the next image
            alpha = 0;
            currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        
            if (currentIndex === 0) {
              // Stop the animation loop if we've reached the final image
              clearInterval(intervalId);
              stopRecording()
              return;
            }
          }
        }
        
        
      
        function startDrawing() {
          // Start the animation loop
          intervalId = setInterval(draw, fps); 
        }
      
        function stopDrawing() {
          // Stop the animation loop
          clearInterval(intervalId);
        }
      
        if (images.length < 2) {
          alert('Please add more than one image!');
        } else {
          startDrawing();
        }
      
        return stopDrawing;
      }

      function handleFileInputChange(event) {
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
      }
      

    return (
      <>
      <div className="flex flex-col"></div>
      
      <canvas className="bg-white mx-auto mt-8" ref={canvasRef} width={512} height={512} />
      <h1 className="w-full text-center font-bold text-2xl pt-6">Add an array of images to start recording...</h1>
      <div className="w-full h-6 flex flex-row justify-center mt-6"><input classNamee="w-full" type="file" accept="image/*" multiple onChange={handleFileInputChange} /></div>

{/*       <button className="w-1/12 mt-4  mx-auto py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={ ()=>{ drawOnCanvas(canvasVideo) } }>Change Canvas</button> */}

      {recording && <button className="w-1/12 mt-4  mx-auto py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={stopRecording}>Stop Recording</button>}
      {videoBlob && <button className="w-1/12 mt-4  mx-auto py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={downloadVideo}>Download Video</button>}
      </>
    );


};

export default Exporter;