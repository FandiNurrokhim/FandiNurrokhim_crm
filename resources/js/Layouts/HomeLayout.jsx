import { usePage } from '@inertiajs/react';

import Navbar from './Navbar';
import HeroSection from '@/Components/Organisms/HeroSection';
import Footer from './Footer';
import BottomNav from './BottomNav';

export default function HomeLayout({ className, children }) {
    const { url } = usePage();
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            
            <main
                className={`${className}`} >
                {children}
            </main>
            <Footer />
            <BottomNav />
        </div >
    );
}
