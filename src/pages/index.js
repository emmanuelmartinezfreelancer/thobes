import Image from 'next/image'
import { Inter } from 'next/font/google'
import CarrouselVideo from "@/components/CarrouselVideo";
import { useState } from "react";
import YouTube from 'react-youtube';
import Exporter from '@/components/Exporter';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [imagesCarousel, setImagesCarousel] = useState([
    "ulOgzjdBdzY",
    "qsUXeXms8FQ",
    "O3_2ZMEK1aw",
    "BOtGF5LHSbA",
    "tvNSXS4x9nc",
    "9qoooUVu1cg",
    "B7Y4LHbpXv0",
    "3bhfvzJoB4M",
    "k-txILGo0SM",
    "q5rliCxX8xc"
  ])

  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImage,setmodalImage] = useState(false);
  const [bgmodalImage, setbgmodalImage] = useState("");
  const [ videoIdFull, setvideoIdFull ] = useState("")


const handleLeftClick = () => {
setCurrentIndex((prevIndex) =>
prevIndex === 0 ? imagesCarousel.length - 1 : prevIndex - 1
);
setvideoIdFull(imagesCarousel[currentIndex])
};

const handleRightClick = () => {
setCurrentIndex((prevIndex) =>
prevIndex === imagesCarousel.length - 1 ? 0 : prevIndex + 1
);
setvideoIdFull(imagesCarousel[currentIndex])
};

const onPlayerEsc = (event) => {
  // access to player in all event handlers via event.target
  event.target.pauseVideo();
}

const opts = {
  height: '720',
  width: '1280',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className} bg-[#47333E]`}
    >
      { modalImage &&
      <div

      className="flex flex-row fixed w-full h-full bg-black bg-opacity-80 z-50 justify-center"
      >     
            
            <button 
            onClick={handleLeftClick}
            className="text-4xl w-1/12 text-white bg-black shadow-black shadow-xl z-[99]"> 
              {"<"}
            </button>
            <div className="flex flex-col my-auto gap-3">
            <button className="text-white text-4xl w-full mt-auto hover:text-gray-400"
            onClick={()=>{ setmodalImage(false) }}
            >{"X"}</button>
            <YouTube 
            className=""
            onClick={(e) => 
              {
              console.log("e", e)
              
              //onPlayerEsc(e)
              }
              
            }
            videoId={videoIdFull} 
            opts={opts}
            />

            </div>


            <button 
            onClick={handleRightClick}
            className="text-4xl w-1/12 text-white bg-black shadow-black shadow-xl z-[99]">
            {">"}
            </button>
     
            </div>
    }
     <div className="flex flex-row pt-24">

      <CarrouselVideo
          setCurrentIndex={setCurrentIndex}
          setbgmodalImage={setbgmodalImage}      
          setmodalImage={setmodalImage}
          images={imagesCarousel}
          setvideoIdFull={setvideoIdFull}
          />   

    </div>

    <div className="flex  flex-col w-full  bg-[#c2b2bb] h-fit pb-48 mt-14"><Exporter /></div>

    </main>
  )
}
