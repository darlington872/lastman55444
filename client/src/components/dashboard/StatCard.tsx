import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger";
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  actionLink?: {
    text: string;
    url: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  progress,
  actionLink,
}) => {
  const colorStyles = {
    primary: {
      iconBg: "bg-gradient-to-br from-purple-600 to-indigo-700",
      cardBg: "vibrant-card",
      valueClass: "vibrant-gradient-text",
      progressBg: "bg-gradient-to-r from-purple-500 to-indigo-600",
      linkClass: "text-purple-400 hover:text-purple-300",
    },
    success: {
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-700",
      cardBg: "vibrant-card-alt",
      valueClass: "rainbow-text",
      progressBg: "bg-gradient-to-r from-green-500 to-emerald-600",
      linkClass: "text-emerald-400 hover:text-emerald-300",
    },
    warning: {
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-700",
      cardBg: "glowing-card",
      valueClass: "neon-text",
      progressBg: "bg-gradient-to-r from-amber-500 to-orange-600",
      linkClass: "text-amber-400 hover:text-amber-300", 
    },
    danger: {
      iconBg: "bg-gradient-to-br from-red-500 to-pink-700",
      cardBg: "vibrant-card",
      valueClass: "vibrant-gradient-text",
      progressBg: "bg-gradient-to-r from-red-500 to-pink-600",
      linkClass: "text-red-400 hover:text-red-300",
    },
  };

  const style = colorStyles[color];

  return (
    <div className={`${style.cardBg} p-6 relative overflow-hidden`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full text-white ${style.iconBg}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm text-gray-300 font-medium">{title}</p>
          <p className={`text-xl font-bold ${style.valueClass}`}>{value}</p>
        </div>
      </div>
      {progress && (
        <div className="mt-4">
          <div className="bg-gray-800/50 h-2 rounded-full overflow-hidden">
            <div
              className={`${style.progressBg} h-2 rounded-full`}
              style={{
                width: `${Math.min(
                  100,
                  (progress.current / progress.total) * 100
                )}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-300 mt-1">{progress.label}</p>
        </div>
      )}
      {subtitle && <div className="mt-4">
        <p className="text-sm text-gray-300">{subtitle}</p>
      </div>}
      {actionLink && (
        <div className="mt-4">
          <a
            href={actionLink.url}
            className={`text-sm ${style.linkClass} flex items-center w-fit`}
          >
            {actionLink.text}{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default StatCard;
