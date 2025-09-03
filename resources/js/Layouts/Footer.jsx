import { Typography } from "@material-tailwind/react";
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaFacebook,
  FaInstagramSquare,
  FaLinkedin,
  FaGithub,
  FaGitlab,
} from "react-icons/fa";
import {
  ShieldCheckIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[#0E1C2D] lg:block hidden">
      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <div class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              John Doe
            </div>
            <Typography className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Fandi Nurrokhim
            </Typography>
            <p class="text-gray-400 mb-6">Full Stack Developer • Turning Ideas Into Reality</p>
            <div class="flex justify-center gap-6 mb-8">

              <Link href="/">
                <FaGithub />
              </Link>
              <Link href="/">
                <FaGitlab />
              </Link>
              <Link href="/">
                <FaFacebook />
              </Link>
              <Link href="/">
                <FaFacebook />
              </Link>
              <Link href="/">
                <FaInstagramSquare />
              </Link>
              <Link href="/">
                <FaLinkedin />
              </Link>
            </div>
            <div class="border-t border-gray-800 pt-8">
              <Typography className="text-xs text-[#C69C6D] mt-10">
                &copy; {currentYear}. Fandi Nurrokhim. All rights reserved. Made with ❤️ and lots of ☕.
              </Typography>
            </div>
          </div>
        </div>
      </footer>

    </footer>
  );
}
