import { Star } from "lucide-react";

export default function StarRating({ value = 0 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < value ? "fill-[#f4b400] text-[#f4b400]" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
