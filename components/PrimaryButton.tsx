import { Button } from "./ui/button";

function PrimaryButton(props: any) {
  return (
    <Button
      {...props}
      className="py-5 text-xs font-semibold text-white"
      size={"sm"}
    ></Button>
  );
}

export default PrimaryButton;
