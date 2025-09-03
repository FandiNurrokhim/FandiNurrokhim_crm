import React from "react";
import { Link } from "@inertiajs/react";
import { getImageUrl } from "@/Utils/imageHelper";

const ProjectCard = ({ project }) => (
    <Link
        href={route("project.detail", { id: project.id })}
        className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        style={{ overflow: "visible" }}
    >
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <img
                alt={project.image}
                className="w-full md:h-40 h-28 rounded-t-xl object-cover object-center"
                height="180"
                src={getImageUrl(project.image)}
                width="320"
            />
        </div>
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {project.techs.map((tech, idx) => (
                    <span
                        key={idx}
                        className={`px-3 py-1 text-xs rounded-full ${tech.bg} ${tech.text}`}
                    >
                        {tech.name}
                    </span>
                ))}
            </div>
            <div className="flex gap-4">
                {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-700">
                        <i data-lucide="github" className="w-4 h-4"></i>
                        GitHub
                    </a>
                )}
                {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        <i data-lucide="external-link" className="w-4 h-4"></i>
                        Live Demo
                    </a>
                )}
            </div>
        </div>
    </Link>
);

export default ProjectCard;