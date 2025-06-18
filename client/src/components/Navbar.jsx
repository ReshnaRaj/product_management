import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";
import WishlistDrawer from "@/components/WishlistDrawer";
import { useState } from "react";

export default function Navbar({
  wishlistCount = 0,
  search,
  setSearch,
  setPage,
}) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAuth = () => {
    if (user) {
      handleLogout();
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="h-14 w-full bg-primary-foreground shadow flex items-center justify-between px-6">
      {/* search */}
      <form className="mx-auto w-full max-w-lg flex">
        <Input
          placeholder="Search any laptop"
          type="text"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
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
        <Button variant="ghost" size="sm" onClick={handleAuth}>
          {user ? "Log out" : "Sign in"}
        </Button>
        {/* wishlist icon */}
        <div
          className="relative cursor-pointer"
          //  onClick={() => setWishlistOpen(true)}
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
      <WishlistDrawer
        open={wishlistOpen}
        // onOpenChange={setWishlistOpen}
        // items={wishlistItems}
        // onRemove={handleRemove}
      />
    </header>
  );
}
