import React from 'react';

const ExperienceItem = ({ experience, isOdd }) => {
    return (
        <div className={`flex items-center ${isOdd ? 'text-right' : ''}`}>
            {!isOdd && (
                <>
                    <div className="w-1/2 pr-8 md:block hidden"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10 md:block hidden"></div>
                </>
            )}
            <div className={`w-full md:w-1/2 md:pr-8 ${isOdd ? 'text-right' : ''}`}>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-blue-600">{experience.title}</h3>
                    <h4 className="font-medium text-gray-600 dark:text-gray-300">{experience.company}</h4>
                    <p className="text-sm text-gray-500 mb-3">{experience.duration}</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                        {experience.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                        ))}
                    </ul>
                </div>
            </div>
            {isOdd && (
                <>
                    <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10 md:block hidden"></div>
                    <div className="w-1/2 pr-8 md:block hidden"></div>
                </>
            )}
        </div>
    );
};

export default ExperienceItem;