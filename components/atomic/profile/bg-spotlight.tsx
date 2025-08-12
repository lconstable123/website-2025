import React from "react";

export default function BgSpotlight() {
  return (
    <div
      className={`pointer-events-none  flex items-center justify-center absolute top-1/2 left-1/2 w-full sm:w-[90vw] h-300 -translate-x-1/2 -translate-y-1/2 
        bg-radial from-blue-200/4 via-gray-100/0  to-gray-100/0 rounded-full  -z-3  `}
    />
  );
}
