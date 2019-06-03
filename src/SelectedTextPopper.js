import React, { useRef, forwardRef } from "react";
import useTextSelection from "./hooks/useTextSelection";

function SelectedTextPopper({ children, props }) {
  // const text = useTextSelection(childRef);

  // // need to have a check that TextSelectPopper
  // // is only one React Child
  // return forwardRef((props, ref) =>
  //   React.Children.only(React.cloneElement(children, { ...props, ref }))
  // );
  return <div>Yeah science</div>
}

export default SelectedTextPopper;
