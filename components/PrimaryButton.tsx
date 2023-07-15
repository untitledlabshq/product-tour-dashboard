import { Button } from "./ui/button";

function PrimaryButton(props: any) {
  return (
    <Button
      className="py-5 text-xs font-semibold text-white"
      size={"sm"}
      {...props}
    ></Button>
  );
}

export default PrimaryButton;
