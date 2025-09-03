import React from 'react';
import Heading from "@/Components/Atoms/Portfolio/Education/Heading";
import Divider from "@/Components/Atoms/Portfolio/Education/Divider";
import { Typography, Button } from "@material-tailwind/react";
import { Fade } from "react-awesome-reveal";

// Icons
import { FaDownload, FaMailBulk } from 'react-icons/fa';

export default function HeroSection() {
    return (
        <>
            <section
                id="home"
                className="min-h-screen flex items-center justify-center relative overflow-hidden "
                style={{ backgroundImage: "radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)" }}
            >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center text-white px-4">
                    <Fade direction="up" triggerOnce>
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-sm"></div>
                            <img
                                src="/assets/img/my-photo.png"
                                alt="Profile"
                                className="relative w-32 h-32 rounded-full border-4 border-white/20"
                                style={{ zIndex: 1 }}
                            />
                        </div>
                        <Typography
                            variant="h1"
                            className="text-5xl md:text-7xl font-bold mb-4 dark:text-white text-gray-900 font-display"
                        >
                            Fandi Nurrokhim
                        </Typography>
                        <Typography
                            variant="h2"
                            className="text-2xl md:text-3xl mb-6 text-blue-200 dark:text-orange-400 font-semibold font-display"
                        >
                            Full Stack Web Developer
                        </Typography>
                        <Typography
                            variant="body1"
                            className="text-xl mb-8 max-w-2xl mx-auto text-gray-200 dark:text-gray-300 font-light font-body"
                        >
                            Passionate about creating amazing web experiences with modern technologies
                        </Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900 animate-bounce-fun"
                                ripple={true}
                            >
                                <FaDownload />
                                Download CV
                            </Button>
                            <Button
                                size="lg"
                                variant="outlined"
                                className="border-2 dark:bg-white border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white animate-bounce-fun"
                                ripple={true}
                            >
                                <FaMailBulk />
                                Contact Me
                            </Button>
                        </div>
                    </Fade>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <i data-lucide="chevron-down" className="w-8 h-8 text-white dark:text-blue-400"></i>
                </div>
            </section>

            <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Heading size="4xl" className="mb-4 dark:text-white text-gray-900 font-display">Skills & Technologies</Heading>
                        <Divider />
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <Fade direction="up" cascade damping={0.2} triggerOnce>
                            <div>
                                <Typography variant="h3" className="text-2xl font-semibold mb-6 dark:text-blue-400 text-blue-600 font-display">
                                    Hello! I'm a Full Stack Developer
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 dark:text-gray-300 mb-6 font-body">
                                    I'm a passionate full stack developer with 5+ years of experience in creating robust, scalable web applications.
                                    I love turning complex problems into simple, beautiful designs and bringing ideas to life through code.
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 dark:text-gray-300 mb-6 font-body">
                                    My expertise spans across modern JavaScript frameworks, backend technologies, and database management.
                                    I'm always eager to learn new technologies and take on challenging projects.
                                </Typography>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant="h4" className="font-semibold text-blue-600 dark:text-blue-400 font-display">Name:</Typography>
                                        <Typography variant="body2" className="font-body dark:text-white text-gray-900">John Doe</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="h4" className="font-semibold text-blue-600 dark:text-blue-400 font-display">Experience:</Typography>
                                        <Typography variant="body2" className="font-body dark:text-white text-gray-900">5+ Years</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="h4" className="font-semibold text-blue-600 dark:text-blue-400 font-display">Location:</Typography>
                                        <Typography variant="body2" className="font-body dark:text-white text-gray-900">Jakarta, Indonesia</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="h4" className="font-semibold text-blue-600 dark:text-blue-400 font-display">Email:</Typography>
                                        <Typography variant="body2" className="font-body dark:text-white text-gray-900">john@example.com</Typography>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg">
                                    <Typography variant="h4" className="text-xl font-semibold mb-6 dark:text-blue-400 text-blue-600 font-display">What I Do</Typography>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                <i data-lucide="code" className="w-6 h-6 text-blue-600 dark:text-blue-400"></i>
                                            </div>
                                            <div>
                                                <Typography variant="h5" className="font-semibold font-display dark:text-white text-gray-900">Frontend Development</Typography>
                                                <Typography variant="body2" className="text-sm text-gray-600 dark:text-gray-300 font-body">React, Vue.js, Angular</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                                <i data-lucide="server" className="w-6 h-6 text-green-600 dark:text-green-400"></i>
                                            </div>
                                            <div>
                                                <Typography variant="h5" className="font-semibold font-display dark:text-white text-gray-900">Backend Development</Typography>
                                                <Typography variant="body2" className="text-sm text-gray-600 dark:text-gray-300 font-body">Node.js, Python, PHP</Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                                <i data-lucide="database" className="w-6 h-6 text-purple-600 dark:text-purple-400"></i>
                                            </div>
                                            <div>
                                                <Typography variant="h5" className="font-semibold font-display dark:text-white text-gray-900">Database Management</Typography>
                                                <Typography variant="body2" className="text-sm text-gray-600 dark:text-gray-300 font-body">MySQL, MongoDB, PostgreSQL</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </div>
                </div>
            </section>
        </>
    );
}