import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <MagnifyingGlassIcon className="h-16 w-16 text-purple-500 mx-auto mb-8 animate-pulse" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition transform">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}
