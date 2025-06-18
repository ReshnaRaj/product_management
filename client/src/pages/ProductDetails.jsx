import { useState } from "react";
import { Button } from "@/components/ui/button";

 

export default function ProductDetails() {
  const [selectedImg, setSelectedImg] = useState(product.images[0]);

  return (
    <div className="p-6 bg-white rounded shadow w-full max-w-4xl mx-auto">
      <div className="flex gap-6">
        {/* Left - Images */}
        <div className="flex-1">
          <img
            src={selectedImg}
            alt="Product"
            className="w-full rounded border"
          />
          <div className="flex gap-2 mt-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Thumb"
                onClick={() => setSelectedImg(img)}
                className={`w-16 h-16 rounded border cursor-pointer ${
                  selectedImg === img ? "ring-2 ring-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right - Info */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-lg font-bold text-green-600">${product.price}</p>
          <p className="text-sm text-gray-500">
            Availability: {product.status}
          </p>
          <div className="text-sm">Variants:</div>
          <div className="flex gap-3">
            {product.variants.map((v, i) => (
              <div key={i} className="border px-2 py-1 rounded text-sm">
                {v.ram} - ${v.price}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <Button className="bg-[#d89e00] text-white">Edit Product</Button>
            <Button variant="outline">Buy Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
