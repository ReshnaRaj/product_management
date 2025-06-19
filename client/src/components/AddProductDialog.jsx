import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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
import { Ellipsis, X } from "lucide-react"; // Import X for the cross icon

export default function AddProductDialog({
  open,
  setOpen,
  onSave,
  subCategories = [],
  initialData = null,
  isEditMode = false,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 2. Add loading state

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

  const handleSubmit = async () => {
    // Validate description
    if (!product.description.trim()) {
      setError("Description is required.");
      return;
    }

    // Validate images
    if (!product.images || product.images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    // Validate variants
    if (!product.variants.length) {
      setError("At least one variant is required.");
      return;
    }
    for (let v of product.variants) {
      if (
        !v.ram?.toString().trim() ||
        !v.price?.toString().trim() ||
        !v.qty?.toString().trim()
      ) {
        setError("All variant fields are required.");
        return;
      }
      if (isNaN(Number(v.ram)) || isNaN(Number(v.price)) || isNaN(Number(v.qty))) {
        setError("RAM, Price, and Quantity must be numbers.");
        return;
      }
    }

    setError("");
    setLoading(true); // Start loading
    try {
      await onSave({
        title: product.title,
        description: product.description,
        subCategory: product.subCategory,
        variants: product.variants.map((v) => ({
          ram: v.ram,
          price: v.price,
          qty: v.qty || v.quantity,
        })),
        images: product.images,
      });

      toast.success(isEditMode ? "Product updated" : "Product added");

      if (!isEditMode) {
        setProduct({
          title: "",
          description: "",
          subCategory: "",
          variants: [{ ram: "", price: "", qty: "" }],
          images: [],
        });
      }

      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (open && isEditMode && initialData) {
      setProduct({
        title: initialData.title || "",
        description: initialData.description || "",
        subCategory: initialData.subCategory || "",
        variants: initialData.variants || [{ ram: "", price: "", qty: "" }],
        images: initialData.images || [],
      });
    }
  }, [open, isEditMode, initialData]);

  // Remove image handler
  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      selectedImageIndex:
        prev.selectedImageIndex === index
          ? 0
          : prev.selectedImageIndex > index
          ? prev.selectedImageIndex - 1
          : prev.selectedImageIndex,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-lg font-semibold">
            {isEditMode ? "Edit Product" : "Add Product"}
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
                {product.images?.map((img, index) => {
                  const src =
                    typeof img === "string"
                      ? img
                      : URL.createObjectURL(img);

                  return (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        onClick={() =>
                          setProduct((prev) => ({
                            ...prev,
                            selectedImageIndex: index,
                          }))
                        }
                        className={`w-16 h-16 object-cover rounded border cursor-pointer
                        ${product.selectedImageIndex === index ? "ring-2 ring-[#1e80ff]" : "border-gray-300"}
                      `}
                      />
                      {/* Cross icon for removing image */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-100 group-hover:opacity-100 opacity-80 transition"
                        title="Remove image"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  );
                })}

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
                      selectedImageIndex:
                        prev.images.length === 0 ? 0 : prev.selectedImageIndex,
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
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                {isEditMode ? "Updating" : "Adding"}
                <Ellipsis className="w-4 h-4" />
              </span>
            ) : isEditMode ? "UPDATE" : "ADD"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setProduct({
                title: "",
                description: "",
                subCategory: "",
                variants: [{ ram: "", price: "", qty: "" }],
                images: [],
              });
              setError("");
              setOpen(false);
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            disabled={loading}
          >
            Discard
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
