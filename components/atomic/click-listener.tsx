import React from "react";
import { useContentClicked } from "../../lib/hooks/hooks";

type TclickListnerProps = {
  ignoreSelf?: boolean;
  debug?: boolean;
  handle: () => void;
};

export default function ClickListener({
  handle,
  ignoreSelf = false,
  debug = false,
}: TclickListnerProps) {
  // states from hooks
  const { buttonRef } = useContentClicked({
    ignoreSelf,
    debug,
    handleEvent: handle,
    //
  });
  return (
    <div
      className={`absolute inset-0 ${debug ? "outline-2 outline-white z-998" : ""}`}
      ref={buttonRef}
    />
  );
}
