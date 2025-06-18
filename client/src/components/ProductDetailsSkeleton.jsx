export default function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse flex flex-col min-h-screen">
      <div className="h-14 w-full bg-gray-100 mb-8"></div>
      <div className="max-w-6xl px-15 mt-20">
        <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
      </div>
      <main className="flex-1 p-6 max-w-6xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
            <div className="flex gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="space-y-2 mt-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between border rounded px-4 py-2">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}