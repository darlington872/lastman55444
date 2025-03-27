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
  const colorClasses = {
    primary: {
      iconBg: "bg-primary-100 text-primary-800",
    },
    success: {
      iconBg: "bg-success-100 text-success-500",
    },
    warning: {
      iconBg: "bg-warning-100 text-warning-500",
    },
    danger: {
      iconBg: "bg-danger-100 text-danger-500",
    },
  };

  const iconClasses = colorClasses[color]?.iconBg || colorClasses.primary.iconBg;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconClasses}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
      {progress && (
        <div className="mt-4">
          <div className="bg-gray-100 h-1 rounded-full">
            <div
              className="bg-primary-500 h-1 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  (progress.current / progress.total) * 100
                )}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{progress.label}</p>
        </div>
      )}
      {subtitle && <div className="mt-4">
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>}
      {actionLink && (
        <div className="mt-4">
          <a
            href={actionLink.url}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {actionLink.text}{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 inline ml-1"
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
