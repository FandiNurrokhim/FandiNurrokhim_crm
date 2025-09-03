import React from 'react';
import Heading from "@/Components/Atoms/Portfolio/Education/Heading";
import Divider from "@/Components/Atoms/Portfolio/Education/Divider";
import ExperienceItem from '@/Components/Atoms/Portfolio/ExperienceItem';
import { Fade } from "react-awesome-reveal";

const ExperienceSection = () => {
    const experiences = [
        {
            title: "Senior Full Stack Developer",
            company: "Tech Innovate Inc.",
            duration: "2022 - Present",
            achievements: [
                "Led development of 3 major web applications",
                "Improved system performance by 40%",
                "Mentored 5 junior developers"
            ]
        },
        {
            title: "Full Stack Developer",
            company: "Digital Solutions Ltd.",
            duration: "2020 - 2022",
            achievements: [
                "Developed e-commerce platform serving 10k+ users",
                "Implemented CI/CD pipelines",
                "Reduced loading time by 60%"
            ]
        },
        {
            title: "Frontend Developer",
            company: "StartUp Pro",
            duration: "2019 - 2020",
            achievements: [
                "Built responsive web applications",
                "Collaborated with design team",
                "Optimized user experience"
            ]
        }
    ];

    return (
        <section id="experience" className="w-full py-20 bg-slate-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Heading size="4xl" className="mb-4">Experience & Achievements</Heading>
                    <Divider />
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-600"></div>
                    <div className="space-y-12">
                        {experiences.map((experience, index) => (
                            <Fade
                                direction={index % 2 === 0 ? "left" : "right"}
                                triggerOnce
                                key={index}
                            >
                                <ExperienceItem experience={experience} isOdd={index % 2 === 0} />
                            </Fade>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;