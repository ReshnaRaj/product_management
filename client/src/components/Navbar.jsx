import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
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
        <ShoppingCart className="h-5 w-5 cursor-pointer" />
      </div>
    </header>
  );
}
