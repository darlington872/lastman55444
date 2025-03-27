import React from "react";
import { Activity } from "@shared/schema";
import { format } from "date-fns";
import { Clock, Activity as ActivityIcon, ArrowRight } from "lucide-react";

interface ActivityTableProps {
  activities: Activity[];
  isLoading: boolean;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ activities, isLoading }) => {
  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "completed") {
      return "bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white";
    } else if (statusLower === "pending") {
      return "bg-gradient-to-r from-amber-500/80 to-orange-600/80 text-white";
    } else if (statusLower === "rejected" || statusLower === "failed") {
      return "bg-gradient-to-r from-red-500/80 to-pink-600/80 text-white";
    }
    return "bg-gradient-to-r from-purple-500/80 to-indigo-600/80 text-white";
  };

  return (
    <div className="vibrant-card overflow-hidden">
      <div className="px-6 py-4 border-b border-purple-900/20 flex items-center justify-between">
        <h2 className="text-lg font-bold vibrant-gradient-text flex items-center gap-2">
          <ActivityIcon className="h-5 w-5" />
          Recent Activity
        </h2>
      </div>
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-t-2 border-r-2 border-pink-500 animate-spin"></div>
              <div className="absolute inset-6 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin"></div>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-900/20 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-purple-300">No activity recorded yet</p>
            <p className="text-sm text-purple-400/70 mt-2">Your activity history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-900/20">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                  >
                    Activity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {activities.map((activity, index) => (
                  <tr 
                    key={activity.id} 
                    className="hover:bg-purple-900/10 transition-colors duration-150"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {activity.createdAt 
                        ? format(new Date(activity.createdAt), "MMM dd, yyyy")
                        : format(new Date(), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusBadgeClass(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTable;
