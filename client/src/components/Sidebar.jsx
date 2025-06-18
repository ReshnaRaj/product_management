import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function Sidebar({
  categories = [],
  subCategories = [],
  activeSubCat = "",
  setActiveSubCat = () => {},
}) {
  const [open, setOpen] = useState({});

  const tree = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        subs: subCategories.filter(
          (sc) =>
            sc.category === cat._id ||
            sc.categoryId === cat._id ||
            sc.categoryId?._id === cat._id
        ),
      })),
    [categories, subCategories]
  );

  const toggleSubCategory = (subId) => {
    const isSelected = activeSubCat === subId;
    setActiveSubCat(isSelected ? "" : subId);
  };

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
                <ul className="pl-4 mt-1 space-y-2">
                  {cat.subs.map((s) => (
                    <li
                      key={s._id}
                      className="flex items-center gap-2 text-[12px]"
                    >
                      <input
                        type="checkbox"
                        checked={activeSubCat === s._id}
                        onChange={() => toggleSubCategory(s._id)}
                        className="w-4 h-4 accent-gray-600"
                      />
                      <label
                        onClick={() => toggleSubCategory(s._id)}
                        className="cursor-pointer"
                      >
                        {s.name}
                      </label>
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
