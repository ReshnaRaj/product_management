export default function ProductSkeleton() {
  return (
    <div className="border rounded-lg p-4 shadow animate-pulse">
      <div className="bg-gray-200 h-40 w-full rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}