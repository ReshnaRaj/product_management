import { Heart } from "lucide-react";
import StarRating from "./StarRating";
export default function ProductCard({ product, isWished, onToggle }) {
  return (
    <div className="relative border rounded-xl p-3 flex flex-col">
      {/* wishlist icon */}
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 cursor-pointer"
      >
        <Heart
          className={`h-4 w-4 transition-all ${
            isWished
              ? "fill-red-500 text-red-500" // filled
              : "text-gray-400 hover:text-red-500"
          }`}
          fill={isWished ? "currentColor" : "none"}
        />
      </button>

      {/* image */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-28 object-contain mb-2"
      />

      {/* details */}
      <h3 className="text-xs font-semibold mb-1 line-clamp-2">
        {product.title}
      </h3>
      <p className="text-sm font-bold text-primary mb-1">${product.price}</p>
      <StarRating value={product.rating} />
    </div>
  );
}
