import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import VariantRow from "./VariantRow";

export default function AddProductDialog({ open, setOpen, onSave, subCategories = [] }) {
  const [product, setProduct] = useState({
    title: "",
    brand: "",
    description: "",
    subCategory: "",
    variants: [{ ram: "", price: "", qty: "" }],
    images: [],
  });

  const handleVariantChange = (i, updated) => {
    const variants = [...product.variants];
    variants[i] = updated;
    setProduct({ ...product, variants });
  };

  const addVariant = () =>
    setProduct({ ...product, variants: [...product.variants, { ram: "", price: "", qty: "" }] });

  const removeVariant = (i) =>
    setProduct({ ...product, variants: product.variants.filter((_, idx) => idx !== i) });

  const handleImageChange = (e) =>
    setProduct({ ...product, images: [...e.target.files] });

  const handleSubmit = () => {
    onSave(product);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Title"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
          />
          <Input
            placeholder="Brand"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          />

          {/* Variants */}
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium">Variants</label>
            {product.variants.map((v, i) => (
              <VariantRow
                key={i}
                index={i}
                data={v}
                onChange={handleVariantChange}
                onRemove={removeVariant}
              />
            ))}
            <Button variant="outline" type="button" size="sm" onClick={addVariant}>
              + Add Variant
            </Button>
          </div>

          {/* Description */}
          <Textarea
            placeholder="Description"
            className="col-span-2"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />

          {/* Sub‑category */}
          <Select
            value={product.subCategory}
            onValueChange={(v) => setProduct({ ...product, subCategory: v })}
          >
            <SelectTrigger className="w-full col-span-1">
              {product.subCategory || "Select sub‑category"}
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((sc) => (
                <SelectItem key={sc.id} value={sc.id}>
                  {sc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Images */}
          <Input
            type="file"
            multiple
            className="col-span-1"
            onChange={handleImageChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
