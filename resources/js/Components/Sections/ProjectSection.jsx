import React from "react";
import Heading from "@/Components/Atoms/Portfolio/Education/Heading";
import Divider from "@/Components/Atoms/Portfolio/Education/Divider";
import ProjectCard from "@/Components/Molecules/Portfolio/ProjectCard";

const projects = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description: "Full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
        techs: [
            { name: "React", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600" },
            { name: "Node.js", bg: "bg-green-100 dark:bg-green-900", text: "text-green-600" },
            { name: "MongoDB", bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-600" },
        ],
        github: "#",
        demo: "#",
    },
];

const ProjectsSection = () => (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <Heading size="4xl" className="mb-4">Featured Projects</Heading>
                <Divider />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                    <ProjectCard key={idx} project={project} />
                ))}
            </div>
        </div>
    </section>
);

export default ProjectsSection;