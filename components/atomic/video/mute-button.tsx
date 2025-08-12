import React from "react";
import { BsVolumeDownFill, BsVolumeMuteFill } from "react-icons/bs";

type MuteProps = {
  isFocussed: boolean;
  toggleMute: (e: React.MouseEvent) => void;
  isLocallyMuted: boolean;
};

export default function MuteButton({
  isFocussed,
  toggleMute,
  isLocallyMuted,
}: MuteProps) {
  return (
    <div
      className={`${isFocussed ? "opacity-100" : "opacity-0"} transition-all duration-900 delay-75 absolute top-2 left-2 z-30 text-white cursor-pointer`}
      onClick={toggleMute}
    >
      {isLocallyMuted ? (
        <BsVolumeMuteFill className="w-7 h-7  video-shadow " />
      ) : (
        <BsVolumeDownFill className="w-7 h-7  video-shadow" />
      )}
    </div>
  );
}
