import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/constants";
import { useAppStore } from "@/store";
import axios from "axios";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";

import PlusIcon from "@/assets/icons/Plus.svg";
import { toast } from "react-toastify";
import useConnect from "@/hooks/useConnect";
import { useRouter } from "next/router";

type Props = {
  onCreate?: Function;
  encryptedAddress?: string;
};

export default function ProjectDialog({ onCreate, encryptedAddress }: Props) {
  const store = useAppStore();

  const { isWeb3 } = useConnect();

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
  });

  function handleChange(event: any) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const toastId = toast.info("Creating...");

      if (isWeb3 && encryptedAddress) {
        await axios.post(API_URL + "/project", formData, {
          headers: {
            Authorization: "web3 " + encryptedAddress,
          },
        });
        toast.success("Created a new project!");
      } else if (store.session && store.session.access_token) {
        await axios.post(API_URL + "/project", formData, {
          headers: {
            Authorization: "web2 " + store.session.access_token,
          },
        });
        toast.success("Created a new project!");
      } else {
        toast.error("An error occurred");
      }

      toast.dismiss(toastId);

      onCreate?.();
    } catch (e) {
      console.error(e);
      toast.error("Error creating a new project");
    } finally {
      setOpen(false);
      setFormData({
        name: "",
        desc: "",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <PrimaryButton>
          New Project &nbsp; <img src={PlusIcon.src} width="18" />
        </PrimaryButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
              Each webapp is a project which contains multiple product tours for
              its pages
            </DialogDescription>
          </DialogHeader>
          <div onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="NFT Minting Site"
                className="col-span-3"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc" className="text-right">
                Description
              </Label>
              <Input
                id="desc"
                name="desc"
                className="col-span-3"
                placeholder="BAYC Mint Page"
                value={formData.desc}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton type="submit">Create</PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
