import React, { useState, useEffect } from "react";
import Heading from "@/Components/Atoms/Portfolio/Education/Heading";
import Divider from "@/Components/Atoms/Portfolio/Education/Divider";
import SkillCard from "@/Components/Molecules/Portfolio/SkillCard";

const skillsData = [
  {
    title: "Frontend",
    icon: { name: "monitor", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900" },
    skills: [
      { name: "React.js", icon: "react" },
      { name: "Vue.js", icon: "vue" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    title: "Backend",
    icon: { name: "server", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900" },
    skills: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Python", icon: "python" },
      { name: "Express.js", icon: "express" },
      { name: "REST APIs", icon: "api" },
    ],
  },
  {
    title: "Tools & Others",
    icon: { name: "settings", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900" },
    skills: [
      { name: "Git", icon: "git" },
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "aws" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
];

const iconMap = {
  react: <i data-lucide="atom" className="w-8 h-8 text-cyan-500" title="React.js"></i>,
  vue: <i data-lucide="triangle" className="w-8 h-8 text-green-500" title="Vue.js"></i>,
  javascript: <i data-lucide="code" className="w-8 h-8 text-yellow-400" title="JavaScript"></i>,
  tailwind: <i data-lucide="wind" className="w-8 h-8 text-sky-400" title="Tailwind CSS"></i>,
  nodejs: <i data-lucide="leaf" className="w-8 h-8 text-green-600" title="Node.js"></i>,
  python: <i data-lucide="activity" className="w-8 h-8 text-blue-400" title="Python"></i>,
  express: <i data-lucide="circle" className="w-8 h-8 text-gray-500" title="Express.js"></i>,
  api: <i data-lucide="cloud" className="w-8 h-8 text-indigo-400" title="REST APIs"></i>,
  git: <i data-lucide="git-branch" className="w-8 h-8 text-orange-500" title="Git"></i>,
  docker: <i data-lucide="box" className="w-8 h-8 text-blue-500" title="Docker"></i>,
  aws: <i data-lucide="cloud-snow" className="w-8 h-8 text-yellow-500" title="AWS"></i>,
  mongodb: <i data-lucide="database" className="w-8 h-8 text-green-700" title="MongoDB"></i>,
};

const SkillsSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heading size="4xl" className="mb-4">Skills & Technologies</Heading>
          <Divider />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(loading ? skillsData : skillsData).map((group, idx) => (
            <SkillCard key={group.title} group={group} iconMap={iconMap} loading={loading} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;