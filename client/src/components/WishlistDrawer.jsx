import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";


export default function WishlistDrawer({
  open,
  onOpenChange,
  items = [],
  onRemove,
}) {
  console.log(items,"items on the wishlist")

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Wishlist</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => onOpenChange(false)}
        >
          ✕
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
        {items.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            No items in wishlist.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 mb-4 border-b pb-2"
            >
              <img
                src={item.images?.[0]}
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-600">
                  ₹{item.variants?.[0]?.price}
                </div>
              </div>
              {onRemove && (
                <button
                  className="text-red-500 hover:underline text-xs"
                  onClick={() => onRemove(item._id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
