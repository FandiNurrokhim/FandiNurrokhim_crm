import { HeartIcon } from '@heroicons/react/24/solid';

export default function Favorite({ count }) {
    return (
        <div className="flex justify-center items-center gap-1 text-red-500">
            <HeartIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{count}</span>
        </div>
    );
}
