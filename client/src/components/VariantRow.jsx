// components/VariantRow.jsx
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function VariantRow({ index, data, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <Input
        placeholder="RAM"
        value={data.ram}
        onChange={(e) => onChange(index, { ...data, ram: e.target.value })}
        className="col-span-3"
      />
      <Input
        placeholder="Price"
        type="number"
        value={data.price}
        onChange={(e) => onChange(index, { ...data, price: e.target.value })}
        className="col-span-3"
      />
      <Input
        placeholder="Qty"
        type="number"
        value={data.qty}
        onChange={(e) => onChange(index, { ...data, qty: e.target.value })}
        className="col-span-3"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="col-span-1 flex justify-center"
      >
        <X className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}
