"use client";

import Image from "next/image";

export default function Opengraph() {
  return (
    <main className="  relative justify-center p-5  w-[1200px] h-[630px] gap-10 bg-black  ">
      <div className="w-full h-full  outline-gray-800 overflow-hidden  border-yellow-700 flex items-center  rounded-2xl">
        <div className="relative overflow-hidden w-[500px]">
          <Image
            src="/new-images/profile2.jpg"
            alt="profile pic"
            width={500}
            height={500}
            quality={95}
            priority={true}
            className="h-180 w-210 border-r-3 border-gray-800   z-30 object-cover shadow-xl pointer-events-none"
          />
          <div className="  absolute scale-120 inset-0 bg-radial from-black/0 to-black/80 via-black/0  rounded-full pointer-events-none "></div>
        </div>
        <div className={` relative  `}>
          {/* <IntroCardTemplate
            rounded="rounded-none"
            secondaryRounded="rounded-none
          "
            outline={true}
          > */}
          {/* <div className="w-full h-full flex-grow border-1"></div> */}

          {/* </IntroCardTemplate> */}
          <div
            className={`flex absolute top-1/2 left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 
            bg-radial from-blue-200/10 via-gray-100/0  to-gray-100/0 rounded-full  -z-1  `}
          />
        </div>
        <div
          id="textgroup"
          className="relative w-[580px] px-15 -translate-y1  "
        >
          <h1 className=" uppercase text-white text-[65pt] Text-secondary font-bold tracking-wider leading-23 mb-6">
            Luke Constable
          </h1>

          <div>
            <ul className=" list-inside  text-gray-100 tracking-wider font-light text-[17pt] space-y-1 ">
              <li>Technical artist</li>
              <li>Accomplished interactive developer</li>
              <li>Award-winning director</li>
            </ul>
          </div>
        </div>
        {/* <div className="absolute w-full inset-0 -z-[7] bg-cover bg-center bg-gradient-to-r from-black/0 sm:via-black/20 to-black/20" /> */}
        {/* <Bg /> */}
      </div>
    </main>
  );
}
