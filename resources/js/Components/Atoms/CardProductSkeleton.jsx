export default function CardProductSkeleton() {
    return (
        <div className="w-full bg-white h-full rounded-xl shadow animate-pulse flex flex-col">
            {/* Gambar Placeholder */}
            <div className="w-full h-40 bg-gray-200 rounded-t-xl"></div>

            {/* Konten Placeholder */}
            <div className="p-4 flex flex-col flex-1 space-y-2">
                {/* Judul */}
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>

                {/* Harga */}
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>

                {/* Rating */}
                <div className="mt-auto flex space-x-1">
                    <div className="h-4 bg-gray-300 rounded w-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-4"></div>
                </div>
            </div>
        </div>
    );
}
