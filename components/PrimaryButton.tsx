import { forwardRef } from "react";
import { Button } from "./ui/button";

const PrimaryButton = forwardRef((props: any, ref) => {
  return (
    <Button
      ref={ref}
      className="py-5 text-xs font-semibold text-white"
      size={"sm"}
      {...props}
    ></Button>
  );
});

export default PrimaryButton;
