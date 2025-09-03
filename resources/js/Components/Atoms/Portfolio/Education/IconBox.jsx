export default function IconBox({ icon, bgColor, iconColor }) {
  return (
    <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
      <i data-lucide={icon} className={`w-6 h-6 ${iconColor}`}></i>
    </div>
  );
};
