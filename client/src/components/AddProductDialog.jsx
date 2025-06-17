import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import VariantRow from "./VariantRow";

export default function AddProductDialog({
  open,
  setOpen,
  onSave,
  subCategories = [],
}) {
   const [error, setError] = useState("");

  const [product, setProduct] = useState({
    title: "",
    
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
    setProduct({
      ...product,
      variants: [...product.variants, { ram: "", price: "", qty: "" }],
    });

  const removeVariant = (i) =>
    setProduct({
      ...product,
      variants: product.variants.filter((_, idx) => idx !== i),
    });

  const handleImageChange = (e) =>
    setProduct({ ...product, images: [...e.target.files] });

  const handleSubmit = async () => {
  // Validate
  const invalidVariant = product.variants.some(
    (v) => !v.ram?.trim() || !v.price || !v.qty
  );

  if (product.variants.length === 0 || invalidVariant) {
    setError("At least one variant is required with RAM, price, and quantity.");
    return;
  }

  setError("");

  try {
    await onSave(product); // assuming this sends the request

    toast.success(
       "Product added successfully!"
      );
    setProduct({
      title: "",
      description: "",
      subCategory: "",
      variants: [{ ram: "", price: "", qty: "" }],
      images: [],
    });

    // Reset form
     

    setOpen(false); // Close modal
  } catch (err) {
    toast({
      title: "Error",
      description: err.message || "Failed to add product",
      variant: "destructive",
    });
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-lg font-semibold">
            Add Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right col-span-1">Title :</label>
            <Input
              className="col-span-3"
              placeholder="Enter product title"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-2">
            <label className="text-right pt-2 col-span-1">Variants :</label>
            <div className="col-span-3 space-y-2">
              {product.variants.map((v, i) => (
                <VariantRow
                  key={i}
                  index={i}
                  data={v}
                  onChange={handleVariantChange}
                  onRemove={removeVariant}
                />
              ))}
              <Button variant="secondary" size="sm" onClick={addVariant}>
                Add variants
              </Button>
              {error && (
  <p className="text-red-500 text-center text-sm mt-4">{error}</p>
)}

            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right col-span-1">Sub category :</label>
            <Select
              value={product.subCategory}
              onValueChange={(v) => setProduct({ ...product, subCategory: v })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((sc) => (
                  <SelectItem key={sc._id} value={sc._id}>
                    {sc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-2">
            <label className="text-right pt-2 col-span-1">Description :</label>
            <Textarea
              className="col-span-3"
              placeholder="Write short product description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

       
{/* Upload Image */}
<div className="grid grid-cols-4 items-start gap-2">
  <label className="text-right pt-2 col-span-1">Upload image :</label>

  <div className="col-span-3 space-y-2">
    <div className="flex gap-2 flex-wrap items-center">
      {product.images?.map((file, index) => (
        <img
          key={index}
          src={URL.createObjectURL(file)}
          alt={`preview-${index}`}
          onClick={() =>
            setProduct((prev) => ({ ...prev, selectedImageIndex: index }))
          }
          className={`w-16 h-16 object-cover rounded border cursor-pointer transition duration-200 ${
            product.selectedImageIndex === index
              ? "ring-2 ring-[#1e80ff]"
              : "border-gray-300"
          }`}
        />
      ))}

      {/* Hidden File Input Triggered by '+' Box */}
      <label
        htmlFor="image-upload"
        className="w-16 h-16 border border-dashed rounded flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100"
      >
        +
      </label>
      <input
        id="image-upload"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files);
          setProduct((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
            selectedImageIndex: prev.images.length === 0 ? 0 : prev.selectedImageIndex,
          }));
        }}
      />
    </div>
  </div>
</div>



        </div>

        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button
            className="bg-[#d89e00] hover:bg-[#b88400] text-white px-6"
            onClick={handleSubmit}
          >
            ADD
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
            onClick={() => setOpen(false)}
          >
            DISCARD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
