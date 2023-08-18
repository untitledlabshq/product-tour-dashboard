import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { Button } from "./ui/button";

type Props = {
  callback?: Function;
};

export default function DeleteDialog({ callback }: Props) {
  const [open, setOpen] = useState(false);

  async function onButtonClick() {
    try {
      await callback?.();
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <button className="mt-3 border-red-400 bg-red-400 hover:bg-red-500 transition text-red-100 text-sm px-3 py-1 rounded-md">
          Delete
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-red-500">
          <DialogHeader>
            <DialogTitle className="text-red-200 font-sans">Confirm Delete</DialogTitle>
            <DialogDescription>
              This action is irreversible, confirm you want to delete this
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <PrimaryButton onClick={() => setOpen(false)}>Cancel</PrimaryButton>
            <Button className="border-red-400 bg-red-500 hover:bg-red-400 transition text-red-100 text-sm px-3 py-1 rounded-md"
            onClick={() => onButtonClick()}
            >
              Delete
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
