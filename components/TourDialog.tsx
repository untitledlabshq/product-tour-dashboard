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
import { useRouter } from "next/router";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import PlusIcon from "@/assets/icons/Plus.svg";
import { toast } from "react-toastify";
import useConnect from "@/hooks/useConnect";
import upperFirst from "lodash/upperFirst";

type Props = {
  onCreate?: Function;
  encryptedAddress?: string;
};

export default function TourDialog({ onCreate, encryptedAddress }: Props) {
  const router = useRouter();
  const store = useAppStore();
  const [open, setOpen] = useState(false);

  const { isWeb3 } = useConnect();

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    url: "",
  });

  function handleChange(event: any) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      const toastId = toast.info("Creating...");

      await axios.post(
        API_URL + "/tour",
        {
          ...formData,
          project_id: router.query.id,
          active: false,
        },
        {
          headers: {
            Authorization: isWeb3
              ? "web3 " + encryptedAddress
              : "web2 " + store.session.access_token,
          },
        }
      );

      toast.dismiss(toastId);
      toast.success("Created a new tour!");

      onCreate?.();
    } catch (e: any) {
      console.error(e);
      toast.error(
        e.response.data
          ? upperFirst(e.response.data.toLowerCase())
          : "Error creating a new tour"
      );
    } finally {
      setOpen(false);
      setFormData({
        name: "",
        desc: "",
        url: "",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <PrimaryButton>
          New Tour &nbsp; <img src={PlusIcon.src} width="18" />
        </PrimaryButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Tour</DialogTitle>
            <DialogDescription>
              Each Tour operates on a single page URL
            </DialogDescription>
          </DialogHeader>
          <div onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Mint Page"
                className="col-span-3"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL*
              </Label>
              <Input
                type="url"
                id="url"
                name="url"
                className="col-span-3"
                placeholder="https://buildoor.xyz/"
                value={formData.url}
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
                placeholder="Primary Tour"
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
