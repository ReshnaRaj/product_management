import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getSingleProduct, updateProduct } from "@/api/axios/product";
import { Heart } from "lucide-react";
import AddProductDialog from "./AddProductDialog";
import { getSubCategory } from "@/api/axios/category";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchSubCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getSingleProduct(id);

      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
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
  const handleEditProduct = async (updatedProductData) => {
    try {
      const formData = new FormData();

      // Append basic product info
      formData.append("name", updatedProductData.title);
      formData.append("description", updatedProductData.description);
      formData.append("subCategoryId", updatedProductData.subCategory);

      // Handle existing and new images
      updatedProductData.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      // Convert variants to the expected format
      const variantsData = updatedProductData.variants.map((v) => ({
        ram: v.ram,
        price: Number(v.price),
        qty: Number(v.qty),
      }));

      formData.append("variants", JSON.stringify(variantsData));

      const response = await updateProduct(id, formData);
      console.log("Update response:", response);

      await fetchProduct();
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar
      // wishlistCount={0}
      // search=""
      // setSearch={() => {}}
      // setPage={() => {}}
      />
      <div className="max-w-6xl   px-15">
        {" "}
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
              {/* <Heart className="w-5 h-5 text-gray-400" /> */}
            </div>
            <p className="mt-2 text-gray-700">{product.description}</p>

            {/* Optional Rating Placeholder */}

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
                  qty: v.quantity || v.qty, // Handle both quantity and qty
                })) || [],
              images: product.images || [],
            }}
          />
        </div>
      </main>
    </div>
  );
}
