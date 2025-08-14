import React from "react";
import Loader from "../../sub-components/loader";

export default function VideoImageSkeleton({
  isMobile,
}: {
  isMobile: boolean;
}) {
  return (
    <div className="videoBox p-10 ">
      {/* <div className="absolute inset-4 border-1 rounded-md h-full border-gray-400/30"> */}
      <Loader isLoading isMobile={false} />
      {/* </div> */}
    </div>
  );
}
