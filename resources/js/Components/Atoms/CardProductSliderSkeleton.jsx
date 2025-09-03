export default function CardProductSliderSkeleton() {
    return (
        <div className="flex gap-5 w-full">
            <div className="w-56">
                <div className="w-full h-full rounded-md flex items-center justify-center animate-pulse bg-gray-200">
                </div>
            </div>
            <div className="flex gap-4 flex-1">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="w-56 h-72 rounded-xl shadow flex flex-col animate-pulse bg-gray-200">
                        <div className="h-40 rounded-t-xl w-full bg-gray-300"></div>
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
                ))}
            </div>
        </div>
    );
}
