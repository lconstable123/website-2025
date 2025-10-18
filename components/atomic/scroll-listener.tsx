import React, { useEffect } from "react";
import { useScreenContext } from "../../lib/context-providers/screen-context";

export default function ScrollListener({ handle }: { handle: () => void }) {
  // const isMobile = useScreenContext();
  useEffect(() => {
    const onScroll = () => {
      //
      // if (isMobile) return;
      handle();
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div></div>;
}
