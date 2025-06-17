import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import AddProductDialog from "@/components/AddProductDialog";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import AddSubCategoryDialog from "@/components/AddSubCategoryDialog";
import {
  addCategory,
  addSubCategory,
  getCategory,
  getSubCategory,
} from "@/api/axios/category";
import {
  addProduct,
  addToWishlist,
  getProducts,
  getWishlist,
  removeFromWishlist,
} from "@/api/axios/product";

export default function Home() {
  const [page, setPage] = useState(1);
  const [showProduct, setShowProduct] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [showSubCat, setShowSubCat] = useState(false);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]); // for sub-categories
  const [products, setProducts] = useState([]); // for products
  const API_BASE = import.meta.env.VITE_API_URL;
  const handleAddCategory = async (name) => {
    try {
      const data = await addCategory({ name });

      setCategories((prev) => [...prev, data.category]);
    } catch (err) {
      alert(err.message || "Failed to add category");
    }
  };
  const handleAddSubCategory = async ({ name, parentId }) => {
    try {
      const response = await addSubCategory({ name, categoryId: parentId });

      setAllSubCategories((prev) => [...prev, response.subCategory]);
    } catch (err) {
      alert(err.message || "Failed to add sub-category");
    }
  };
  const handleAddProduct = async (product) => {
    try {
      console.log("Adding product:", product);

      const formData = new FormData();
      formData.append("name", product.title);

      formData.append("description", product.description);
      formData.append("subCategoryId", product.subCategory);
      formData.append("variants", JSON.stringify(product.variants));
      product.images.forEach((file) => formData.append("images", file));

      const res = await addProduct(formData);
      console.log("Product added:", res);
      const patched = {
        ...res.product,
        images: res.product.images.map((img) =>
          img.startsWith("http") ? img : `${API_BASE}${img}`
        ),
      };

      setProducts((prev) => [...prev, patched]);
      setShowProduct(false); // close modal
    } catch (err) {
      alert(err.message || "Failed to add product");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategory();

      setCategories(response);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };
  const fetchSubCategories = async () => {
    try {
      const response = await getSubCategory();

      setAllSubCategories(response);
    } catch (err) {
      console.error("Failed to fetch sub-categories:", err);
    }
  };
  const fetchProducts = async (pageNum = 1) => {
    try {
      const response = await getProducts(pageNum);
      console.log(response, "response");
      const fetchedProducts = response.products;

      const patchedProducts = fetchedProducts.map((p) => ({
        ...p,
        images: p.images.map((img) =>
          img.startsWith("http") ? img : `${API_BASE}${img}`
        ),
      }));
      const finalProducts = patchedProducts.map((p) => ({
        ...p,
        isWished: wishlistIds.includes(p._id),
      }));

      setProducts(finalProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts(page);
  }, [page]);
  useEffect(() => {
    getWishlist().then((res) => {
      const ids = res.map((p) => p._id);
      setWishlistIds(ids);
    });
  }, []);
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => ({
        ...p,
        isWished: wishlistIds.includes(p._id),
      }))
    );
  }, [wishlistIds]);

  const toggleWishlist = async (productId) => {
    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* navbar */}
      <Navbar wishlistCount={wishlistIds.length} />

      {/* content */}
      <div className="flex flex-1">
        {/* sidebar */}

        <Sidebar categories={categories} subCategories={allSubCategories} />

        {/* main */}
        <main className="flex-1 p-6">
          {/* action buttons */}
          <div className="flex gap-3 mb-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCat(true)}
            >
              Add category
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubCat(true)}
            >
              Add sub‑category
            </Button>
            <Button size="sm" onClick={() => setShowProduct(true)}>
              Add product
            </Button>
          </div>

          {/* products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={{
                  image: p.images[0],
                  title: p.title,
                  price: p.variants[0]?.price ?? 0,
                }}
                isWished={p.isWished}
                onToggle={() => toggleWishlist(p._id)}
              />
            ))}
          </div>

          {/* bottom bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">12 total items</span>

            <Pagination page={page} pages={6} setPage={setPage} />

            <div className="text-xs">
              Show&nbsp;
              <select className="text-xs border rounded px-1 py-0.5">
                <option>12</option>
                <option>24</option>
              </select>
            </div>
          </div>
        </main>
      </div>
      <AddProductDialog
        open={showProduct}
        setOpen={setShowProduct}
        subCategories={allSubCategories}
        // onSave={(data) => dispatch(createProduct(data))}
        onSave={handleAddProduct}
      />
      <AddCategoryDialog
        open={showCat}
        setOpen={setShowCat}
        // onSave={(name) => dispatch(createCategory(name))}
        onSave={handleAddCategory}
      />
      <AddSubCategoryDialog
        open={showSubCat}
        setOpen={setShowSubCat}
        categories={categories}
        // onSave={(data) => dispatch(createSubCategory(data))}
        onSave={handleAddSubCategory}
      />
    </div>
  );
}
