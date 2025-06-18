import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";

/**
 * @param {boolean}  open            – show / hide drawer
 * @param {Function} onOpenChange    – (bool)=>void  toggler
 * @param {Array}    items           – wishlist items [{ _id, title, price, images:[] }]
 * @param {Function} onRemove        – (id)=>void    remove handler
 */
export default function WishlistDrawer({
  open,
  onOpenChange,
  items = [],
  onRemove,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ---- white panel on the right ---- */}
      <DialogContent
        className="fixed   rounded-none
                   px-0 pb-0 pt-0 bg-white shadow-xl overflow-y-auto z-50"
      >
        {/* header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <DialogTitle className="text-base font-medium">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </DialogTitle>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* list */}
        <div className="h-[calc(100vh-56px)] overflow-y-auto divide-y">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Your wishlist is empty.</p>
          ) : (
            items.map((it) => (
              <div key={it._id} className="flex p-4 gap-3">
                <img
                  src={it.images?.[0]}
                  alt={it.title}
                  className="w-12 h-12 object-contain border rounded"
                />
                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-medium">{it.title}</p>
                  <p className="text-xs text-gray-600 mt-1">₹{it.price}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove?.(it._id)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
