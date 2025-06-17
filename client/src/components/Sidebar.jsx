import { ChevronRight, ChevronDown } from "lucide-react";
import { useState,useMemo } from "react";

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

export default function Sidebar({ categories = [], subCategories = [] }) {
  
  const [open, setOpen] = useState({});
  
 const tree = useMemo(() =>
  categories.map((cat) => ({
    ...cat,
    subs: subCategories.filter((sc) =>
      sc.category === cat._id || sc.categoryId === cat._id || sc.category?._id === cat._id
    ),
  })),
  [categories, subCategories]
);


 

  return (
    <aside className="w-56 border-r p-4 space-y-6">
      <div className="text-sm font-medium flex items-center justify-between">
        Home
        <ChevronRight className="h-4 w-4" />
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Categories</h4>

        <ul className="space-y-1">
          {tree.map((cat) => (
            <li key={cat._id}>
              <button
                className="flex items-center justify-between w-full text-left text-xs hover:text-primary"
                onClick={() =>
                  setOpen((prev) => ({ ...prev, [cat._id]: !prev[cat._id] }))
                }
              >
                {cat.name}
                {open[cat._id] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {open[cat._id] && (
                <ul className="pl-4 mt-1 space-y-1">
                  {cat.subs.map((s) => (
                    <li
                      key={s._id}
                      className="text-[11px] cursor-pointer hover:text-primary"
                    >
                      {s.name}
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
