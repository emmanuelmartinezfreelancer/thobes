import React, { useState } from "react";
import Image from 'next/image'
import YouTube from 'react-youtube';

const CarrouselVideo = ({ setCurrentIndex, setbgmodalImage, setmodalImage, setImagesCarousel, handleLeftClick, images, setvideoIdFull }) => {

  const handleClick = (index) => {
    setCurrentIndex(index);
    setbgmodalImage(`url("${images[index]}")`);
  };

  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex(startIndex + 5);
  };

  const handlePrev = () => {
    setStartIndex(startIndex - 5);
  };

const currentImages = images.slice(startIndex, startIndex + 5);

const opts = {
  height: '240',
  width: '320',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
};

const onPlayerReady = (event) => {
  // access to player in all event handlers via event.target
  event.target.pauseVideo();
}

console.log("images", images)
  return (
    <>
    <div className="carousel flex w-full">
    <button 
      className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100"
      onClick={handlePrev}
      >
      {"<"}
    </button>
      <div className="flex flex-row flex-wrap w-full gap-3 pl-3">
      
      {currentImages.map((image,index) => (
        <>
{/*         <div
            onClick={() => 
              {
              handleClick(index);
              setmodalImage(true)
              }
            }
            key={index}
            className="w-full w-[300px] h-[300px] bg-cover bg-center cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
             style={{ 
                backgroundImage: `url("${image}")`,
              }} 
            >
            </div>  */}
            <YouTube 
            className="cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            onClick={(e) => 
              {
              handleClick(index);
              setmodalImage(true)
              console.log("e", e)

              }
              
            }
            onPlay={(e)=>{ 
              setvideoIdFull(image); 
              handleClick(index);
              setmodalImage(true)     
              onPlayerReady(e)
            }}  
            key={index} videoId={image} opts={opts} onReady={onPlayerReady} />
        </>

      ))}

      
      </div>
      <button 
      className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100"
      onClick={handleNext}
      >
      {">"}
    </button>

    </div>
    </>

    
  );
};

export default CarrouselVideo;