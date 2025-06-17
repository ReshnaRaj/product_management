import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddSubCategoryDialog({
  open,
  setOpen,
  onSave,
  categories,
}) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const empty = categories.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-96 rounded-xl p-8"
        aria-describedby="subcat-desc"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Add Sub Category
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Select disabled={empty} value={parentId} onValueChange={setParentId}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={empty ? "No categories found" : "Select category"}
              />
            </SelectTrigger>

            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sub‑category name */}
          <Input
            placeholder="Enter sub category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={empty}
          />
        </div>

        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button
            size="sm"
            className="px-8 bg-[#d89e00] hover:bg-[#c58900]"
            disabled={empty || !name || !parentId}
            onClick={() => {
              onSave({ name, parentId });
              setName("");
              setParentId("");
              setOpen(false);
            }}
          >
            ADD
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="px-6"
            onClick={() => setOpen(false)}
          >
            DISCARD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
