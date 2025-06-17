import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar({ wishlistCount = 0 }) {
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="h-14 w-full bg-primary-foreground shadow flex items-center justify-between px-6">
      {/* search */}
      <form className="mx-auto w-full max-w-lg flex">
        <Input
          placeholder="Search any laptop"
          className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="rounded-l-none bg-[#d89e00] hover:bg-[#c58900]"
        >
          Search
        </Button>
      </form>

      {/* right side */}
      <div className="flex items-center gap-5">
        {user ? <span className="text-sm">Hi, {user.name}</span> : null}
        <Button variant="ghost" size="sm" onClick={() => {}}>
          {user ? "Log out" : "Sign in"}
        </Button>
        {/* wishlist icon */}
        <div
          className="relative cursor-pointer"
          onClick={() => {
            /* go to wishlist */
          }}
        >
          <Heart className="h-5 w-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {wishlistCount}
            </span>
          )}
        </div>
        <ShoppingCart className="h-5 w-5 cursor-pointer" />
      </div>
    </header>
  );
}
