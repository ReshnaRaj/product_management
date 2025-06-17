import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const data = [
  {
    name: "Laptop",
    sub: ["Dell", "HP", "Apple"],
  },
  {
    name: "Tablet",
    sub: ["iPad", "Galaxy"],
  },
  {
    name: "Headphones",
    sub: ["Sony", "Bose"],
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState({});

  return (
    <aside className="w-56 border-r p-4 space-y-6">
      <div className="text-sm font-medium flex items-center justify-between">
        Home
        <ChevronRight className="h-4 w-4" />
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Categories</h4>

        <ul className="space-y-1">
          {data.map((cat) => (
            <li key={cat.name}>
              <button
                className="flex items-center justify-between w-full text-left text-xs hover:text-primary"
                onClick={() =>
                  setOpen((prev) => ({ ...prev, [cat.name]: !prev[cat.name] }))
                }
              >
                {cat.name}
                {open[cat.name] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {open[cat.name] && (
                <ul className="pl-4 mt-1 space-y-1">
                  {cat.sub.map((s) => (
                    <li
                      key={s}
                      className="text-[11px] cursor-pointer hover:text-primary"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
