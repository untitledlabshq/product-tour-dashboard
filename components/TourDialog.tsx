import { Button } from "@/components/ui/button";
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

export default function TourDialog() {
  const router = useRouter();
  const store = useAppStore();
  const [open, setOpen] = useState(false);

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
      await axios.post(
        API_URL + "/tour",
        {
          ...formData,
          project_id: router.query.id,
          active: false,
        },
        {
          headers: {
            Authorization: "Bearer " + store.session.access_token,
          },
        }
      );

      setOpen(false);
      setFormData({
        name: "",
        desc: "",
        url: "",
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button>+ New Tour</Button>
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
                placeholder="https://www.untitledlabs.io/mint"
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
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
