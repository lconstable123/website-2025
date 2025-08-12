import React from "react";

export default function GlowBg({ w, h }: { w: number; h: number }) {
  return (
    <div
      style={{ width: `${w}px`, height: `${h}px` }}
      className={` flex items-center justify-center absolute   -translate-x-1/2 -translate-y-1/2
        bg-white/10 rounded-md -z-2  blur-4xl `}
    ></div>
  );
}
