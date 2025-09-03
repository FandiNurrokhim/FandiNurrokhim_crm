import React from "react";

const SkillCard = ({ group, iconMap, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white/80 p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <div
          className={`w-16 h-16 ${group.icon.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {loading ? (
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 dark:text-white/60 rounded-full animate-pulse" />
          ) : (
            <i
              data-lucide={group.icon.name}
              className={`w-8 h-8 ${group.icon.color}`}
            ></i>
          )}
        </div>
        <h3 className="text-xl font-semibold">
          {loading ? (
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 dark:text-white/60 rounded animate-pulse mx-auto" />
          ) : (
            group.title
          )}
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 dark:text-white/60 rounded-full animate-pulse mb-2" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 dark:text-white/60 rounded animate-pulse" />
                </div>
              ))
          : group.skills.map((skill) => (
              <div key={skill.name} className="flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  {iconMap[skill.icon]}
                </div>
                <span className="text-sm font-medium">{skill.name}</span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default SkillCard;