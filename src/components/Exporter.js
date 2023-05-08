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
      
        function startDrawing() {
            intervalId = setInterval(() => {
              // Clear the canvas before drawing the next image
              ctx.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
        
              // Draw the current image, adjusted to fit the canvas
              const currentImage = images[currentIndex];
              const destWidth = canvasVideo.width;
              const destHeight = canvasVideo.height;
              const sourceWidth = currentImage.width;
              const sourceHeight = currentImage.height;
              const aspectRatio = sourceWidth / sourceHeight;
        
              if (destWidth / destHeight > aspectRatio) {
                // The canvas is wider than the image, adjust the height
                const destX = 0;
                const destY = (destHeight - destWidth / aspectRatio) / 2;
                ctx.drawImage(currentImage, destX, destY, destWidth, destWidth / aspectRatio);
              } else {
                // The canvas is taller than the image, adjust the width
                const destX = (destWidth - destHeight * aspectRatio) / 2;
                const destY = 0;
                ctx.drawImage(currentImage, destX, destY, destHeight * aspectRatio, destHeight);
              }
        
              // Increment the current index, or wrap around to 0 if we've reached the end of the array
              currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        
              // Stop the interval if we've reached the end of the array
              if (currentIndex === images.length - 1) {
                clearInterval(intervalId);
                stopRecording();
              }
            }, 1000); // Change this value to adjust the time interval between images
          }
    
    function stopDrawing() {
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
        const images = Array.from(files).map(file => {
          const image = new Image();
          image.src = URL.createObjectURL(file);
          return image;
        });
    
        // Draw the images periodically in the canvas
        const stopDrawing = drawImagesPeriodically(images, canvasVideo);

        startRecording()
    
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