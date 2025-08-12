"use client";
import React from "react";

import clsx from "clsx";

export default function Loader({
  isLoading,
  isMobile,
}: {
  isLoading: boolean;
  isMobile: boolean;
}) {
  return (
    <div
      className={clsx(
        "duration-300 transition-all absolute inset-0 z-50 flex items-center pointer-events-none justify-center  ",
        isLoading ? "opacity-100" : "opacity-0"
      )}
    >
      {/* <div className="text-white">Loading video...</div> */}
      <div
        id="loadingspinner"
        className={`${isMobile ? "scale-60" : "scale-100"}`}
      >
        <div id="loadingball1"></div>
        <div id="loadingball2"></div>
      </div>
    </div>
  );
}
