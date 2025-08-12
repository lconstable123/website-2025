import React from "react";

export default function Bg() {
  return (
    <div className="fixed overflow-hidden inset-0 z-[-10] bg-cover bg-center">
      <div className="absolute inset-0 z-[-1] bg-cover bg-center bg1" />

      <div className="absolute inset-0 z-[2] bg-cover bg-center bg-gradient-to-l from-black/35 sm:via-black/0 to-black/35" />
    </div>
  );
}
