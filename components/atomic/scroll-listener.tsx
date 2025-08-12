import React, { useEffect } from "react";

export default function ScrollListener({ handle }: { handle: () => void }) {
  useEffect(() => {
    const onScroll = () => {
      //
      handle();
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div></div>;
}
