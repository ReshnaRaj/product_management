import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import AddProductDialog from "@/components/AddProductDialog";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import AddSubCategoryDialog from "@/components/AddSubCategoryDialog";
import ProductSkeleton from "@/components/ProductSkeleton";
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
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Home() {
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null); // null means Add mode
  const [search, setSearch] = useState("");
  const [activeSubCat, setActiveSubCat] = useState("");
  const [showProduct, setShowProduct] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [showSubCat, setShowSubCat] = useState(false);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]); // for sub-categories
  const [products, setProducts] = useState([]); // for products
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000";
  const handleAddCategory = async (name) => {
    try {
      const data = await addCategory({ name });

      setCategories((prev) => [...prev, data.category]);
      toast.success("Category added successfully");
    } catch (err) {
      alert(err.message || "Failed to add category");
    }
  };
  const handleAddSubCategory = async ({ name, parentId }) => {
    try {
      const response = await addSubCategory({ name, categoryId: parentId });

      setAllSubCategories((prev) => [...prev, response.subCategory]);
      toast.success("Sub-category added successfully");
    } catch (err) {
      alert(err.message || "Failed to add sub-category");
    }
  };
  const handleAddProduct = async (product) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.title);
      formData.append("description", product.description);
      formData.append("subCategoryId", product.subCategory);
      formData.append("variants", JSON.stringify(product.variants));
      product.images.forEach((file) => formData.append("images", file));

      const res = await addProduct(formData);

      const formattedProduct = {
        ...res.product,
        images: res.product.images.map((img) =>
          img.startsWith("http") ? img : `${API_BASE}${img}`
        ),
        isWished: false,
      };

      setProducts((prevProducts) => [formattedProduct, ...prevProducts]);
      setShowProduct(false);
      toast.success("Product added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
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
  const fetchProducts = async (pageNum = 1, searchTerm = "", subCatId = "") => {
    setLoading(true);
    try {
      const response = await getProducts({
        page: pageNum,
        search: searchTerm,
        subCategoryId: subCatId,
      });

      const formattedProducts = response.products.map((p) => ({
        ...p,
        images: p.images.map((img) =>
          img.startsWith("http") ? img : `${API_BASE}${img}`
        ),
        isWished: wishlistIds.includes(p._id),
      }));

      setProducts(formattedProducts);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts(page, search, activeSubCat);
  }, [page, search, activeSubCat]);
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
        // Immediately update the product's isWished property
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === productId ? { ...p, isWished: false } : p
          )
        );
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
        // Immediately update the product's isWished property
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === productId ? { ...p, isWished: true } : p
          )
        );
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* navbar */}
      <Navbar
        wishlistCount={wishlistIds.length}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
      />

      {/* content */}
      <div className="flex flex-1">
        {/* sidebar */}

        <Sidebar
          categories={categories}
          subCategories={allSubCategories}
          activeSubCat={activeSubCat}
          setActiveSubCat={(id) => {
            setPage(1);
            setActiveSubCat(id);
          }}
        />

        {/* main */}
        <main className="flex-1 p-6">
          {/* action buttons */}
          <div className="flex  justify-end gap-3 mb-5">
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
            <Button
              size="sm"
              onClick={() => {
                setEditProduct(null); // ensure it's add mode
                setShowProduct(true);
              }}
            >
              Add product
            </Button>
          </div>

          {/* products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((p) => (
                  <Link to={`/product/${p._id}`} key={p._id}>
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
                  </Link>
                ))}
          </div>

          {/* bottom bar */}
          <div className="flex items-center justify-center gap-4">
            <Pagination page={page} pages={6} setPage={setPage} />
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
