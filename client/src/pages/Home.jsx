import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import AddProductDialog from "@/components/AddProductDialog";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import AddSubCategoryDialog from "@/components/AddSubCategoryDialog";

// dummy products
const demoProducts = [...Array(10)].map((_, i) => ({
  id: i,
  name: "HP AMD Ryzen 3",
  price: (519 + i).toFixed(2),
  rating: 4,
  image: "https://via.placeholder.com/150x100.png?text=Laptop", // placeholder
}));

export default function Home() {
  const [page, setPage] = useState(1);
  const [showProduct, setShowProduct] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [showSubCat, setShowSubCat] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* navbar */}
      <Navbar />

      {/* content */}
      <div className="flex flex-1">
        {/* sidebar */}
        <Sidebar />

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
            {demoProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
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
    
    </div>
  );
}
