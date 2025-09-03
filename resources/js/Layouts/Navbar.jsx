import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <nav className="hidden md:block fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Portfolio
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <Link href="#home" className="text-gray-800 dark:text-white/80 hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Home</Link>
                        <Link href="#about" className="text-gray-800 dark:text-white/80 hover:text-blue-600 dark:hover:text-purple-400 transition-colors">About</Link>
                        <Link href="#skills" className="text-gray-800 dark:text-white/80 hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Skills</Link>
                        <Link href="#experience" className="text-gray-800 dark:text-white/80 hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Experience</Link>
                        <Link href="#education" className="text-gray-800 dark:text-white/80 hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Education</Link>
                        <Link href="#projects" className="text-gray-800 dark:text-white/80 hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Projects</Link>
                        <Link href="#contact" className="text-gray-800 dark:text-white/80 hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}