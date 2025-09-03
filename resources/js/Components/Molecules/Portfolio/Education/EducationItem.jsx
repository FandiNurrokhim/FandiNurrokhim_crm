import IconBox from "@/Components/Atoms/Portfolio/Education/IconBox";
import Heading from "@/Components/Atoms/Portfolio/Education/Heading";

export default function EducationItem({
  title,
  institution,
  date,
  description,
  icon,
  bgColor,
  iconColor,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-start gap-4">
        <IconBox icon={icon} bgColor={bgColor} iconColor={iconColor} />
        <div>
          <Heading size="lg">{title}</Heading>
          <p className="text-sm font-medium text-blue-600">{institution}</p>
          <p className="text-sm text-gray-500">{date}</p>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
