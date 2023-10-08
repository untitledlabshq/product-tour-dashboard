import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store";
import PrimaryButton from "./PrimaryButton";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

type Props = {};

export default function CongratsDialog({}: Props) {
  const open = useAppStore((state) => state.congrats);
  const setOpen = useAppStore((state) => state.setCongrats);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setMounted(true);
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yay 🎉</DialogTitle>
            <DialogDescription>Congrats on Upgrading to Pro!</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <PrimaryButton onClick={() => setOpen(false)}>
              Alright
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
        {mounted && open && <Confetti />}
      </Dialog>
    </>
  );
}
