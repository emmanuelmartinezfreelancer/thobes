import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image'
import YouTube from 'react-youtube';

const CarrouselVideo = ({ setCurrentIndex, setbgmodalImage, setmodalImage, setImagesCarousel, handleLeftClick, images, setvideoIdFull }) => {

  const galleryRef = useRef(null);

  const [thumbnailLoaded, setThumbnailLoaded] = useState(
    Array.from({ length: images.length }, () => false)
  );
  const [thumbnailsSlice, setThumbnailsSlice ] = useState([])

  useEffect(() => {
    const gallery = galleryRef.current;
    const handleTransitionEnd = () => {
      gallery.classList.remove('transitioning');
    };
    gallery.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      gallery.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, []);

  const handleClick = (index) => {
    setCurrentIndex(index);
    setbgmodalImage(`url("${images[index]}")`);
  };

  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex(startIndex + 3);

  };

  const handlePrev = () => {
    setStartIndex(startIndex - 3);

  };

const currentImages = images.slice(startIndex, startIndex + 5);

const opts = {
  height: '240',
  width: '320',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
  playerVars: {
    controls: 0,
  },
};

const onPlayerReady = (event) => {
  // access to player in all event handlers via event.target
  event.target.pauseVideo();
}

const handleReady = (index) => (event) => {
  event.target.pauseVideo(); // pause the video to prevent autoplay
  setThumbnailLoaded((prev) =>
    prev.map((loaded, i) => (i === index ? true : loaded))
  ); // set thumbnailLoaded to true for the corresponding video index
};


const renderVideo = (videoId, index) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <>
      {!thumbnailLoaded[index] && (
        //<p className="bg-black text-white text-center align-center w-[320px] h-[240]">Loading...</p>
        <div className="bg-contain bg-center absolute"
        style={
          {
          width: '320px',
          height: '240px',
          background: `url("${thumbnailUrl}")`,
          }}
        ></div>
      )}
      <YouTube
        className="cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        onClick={() => {
          handleClick(index);
          setmodalImage(true)
          console.log("e", e)
        }}
        onPlay={(e) => {
          setvideoIdFull(videoId); 
          handleClick(index);
          setmodalImage(true)     
          onPlayerReady(e)
        }}
        key={index}
        videoId={videoId}
        opts={opts}
        onReady={handleReady(index)}
      />
    </>
  );
};
  return (
    <>
    <div className="gallery flex w-full" ref={galleryRef}>

    {startIndex > 0 && (
    <button 
      className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100"
      onClick={handlePrev}
      >
      {"<"}
    </button>
    )}

      <div className="images flex flex-row flex-wrap w-full gap-3 pl-3 pr-3">

      
      { currentImages.map((image,index) => (
/*         <>
            {!thumbnailLoaded[index] && <p className="bg-black text-white text-center align-center w-[320px] h-[240]">Loading...</p>}
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
            key={index} videoId={image} opts={opts} onReady={handleReady(index)} />
        </> */

        <div key={index}>
          
        {renderVideo(image, index)}
      </div>

      ))}

      
      </div>
      {startIndex + 5 < images.length && (
      <button 
      className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100"
      onClick={handleNext}
      >
      {">"}
      </button>
      )}

    </div>
    </>

  );
};

export default CarrouselVideo;