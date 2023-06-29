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
import { useState } from "react";

export default function ProjectDialog() {
  const store = useAppStore();

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

    await axios.post(API_URL + "/project", formData, {
      headers: {
        Authorization: "Bearer " + store.session.access_token,
      },
    });

    setOpen(false);
    setFormData({
      name: "",
      desc: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant="secondary">+ New Project</Button>
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
                desc
              </Label>
              <Input
                id="desc"
                name="desc"
                className="col-span-3"
                placeholder="BAYC Mint Page"
                value={formData.desc}
                onInput={handleChange}
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
