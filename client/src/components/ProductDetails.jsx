import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getSingleProduct, updateProduct, addToWishlist, removeFromWishlist } from "@/api/axios/product";
import { Heart } from "lucide-react";
import AddProductDialog from "./AddProductDialog";
import { getSubCategory } from "@/api/axios/category";
import { toast } from "sonner";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [isWished, setIsWished] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchSubCategories();
    fetchWishlistStatus();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getSingleProduct(id);
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await getSubCategory();
      setSubCategories(response);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  // Fetch wishlist status and count
  const fetchWishlistStatus = async () => {
    try {
      const wishlist = await import("@/api/axios/product").then(mod => mod.getWishlist());
      setIsWished(wishlist.some((item) => item._id === id));
      setWishlistCount(wishlist.length);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    try {
      if (isWished) {
        await removeFromWishlist(id);
        setIsWished(false);
        setWishlistCount((c) => c - 1);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(id);
        setIsWished(true);
        setWishlistCount((c) => c + 1);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleEditProduct = async (updatedProductData) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedProductData.title);
      formData.append("description", updatedProductData.description);
      formData.append("subCategoryId", updatedProductData.subCategory);

      updatedProductData.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      const variantsData = updatedProductData.variants.map((v) => ({
        ram: v.ram,
        price: Number(v.price),
        qty: Number(v.qty),
      }));
      formData.append("variants", JSON.stringify(variantsData));

      // Always send removedImages as a JSON string
      formData.append("removedImages", JSON.stringify(updatedProductData.removedImages || []));

      const response = await updateProduct(id, formData);
      await fetchProduct();
      setEditOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    }
  };

  if (loading) return <ProductDetailsSkeleton />;

  if (!product) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass wishlistCount to Navbar */}
      <Navbar wishlistCount={wishlistCount} />
      <div className="max-w-6xl   px-15">
        <div className="text-md text-gray-600 mt-20">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="mx-2">→</span>
          <span>Product Details</span>
        </div>
      </div>

      {/* Main Product Section */}
      <main className="flex-1 p-6 max-w-6xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Product Images */}
          <div>
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-64 object-contain border rounded-xl"
            />
            <div className="flex gap-2 mt-4">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i}`}
                  className="w-16 h-16 object-contain border rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <button
                onClick={handleWishlistToggle}
                aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                className="focus:outline-none"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isWished ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                  fill={isWished ? "currentColor" : "none"}
                />
              </button>
            </div>
            <p className="mt-2 text-gray-700">{product.description}</p>

            {/* Variants */}
            <div className="mt-4 space-y-2">
              {product.variants?.map((v, index) => (
                <div
                  key={index}
                  className="flex justify-between border rounded px-4 py-2"
                >
                  <span>RAM: {v.ram}</span>
                  <span className="text-primary font-semibold">
                    ₹{v.price} / Qty: {v.quantity}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="mt-6 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition mr-6"
              onClick={() => setEditOpen(true)}
            >
              Edit Product
            </button>
            <button className="mt-6 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
              Buy Now
            </button>
          </div>
          <AddProductDialog
            open={editOpen}
            setOpen={setEditOpen}
            onSave={handleEditProduct}
            subCategories={subCategories}
            isEditMode={true}
            initialData={{
              title: product.title,
              description: product.description,
              subCategory: product.subCategoryId?._id || product.subCategoryId,
              variants:
                product.variants?.map((v) => ({
                  ram: v.ram,
                  price: v.price,
                  qty: v.quantity || v.qty,
                })) || [],
              images: product.images || [],
            }}
          />
        </div>
      </main>
    </div>
  );
}
