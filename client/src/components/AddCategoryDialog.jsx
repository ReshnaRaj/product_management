import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddCategoryDialog({ open, setOpen, onSave }) {
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm rounded-xl p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Category
          </DialogTitle>
        </DialogHeader>

        <Input
          className="my-4 text-sm"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <DialogFooter className="flex justify-center gap-3">
          <Button
            disabled={!name.trim()}
            className="bg-[#d89e00] hover:bg-[#b88400] text-white px-6"
            onClick={() => {
              onSave(name.trim());
              setName("");
              setOpen(false);
            }}
          >
            ADD
          </Button>
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300"
            onClick={() => setOpen(false)}
          >
            DISCARD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
