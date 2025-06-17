import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages, setPage }) {
  return (
    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {[...Array(pages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`text-xs w-6 h-6 rounded-full ${
            page === i + 1 ? "bg-primary text-white" : "bg-muted"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className="disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
