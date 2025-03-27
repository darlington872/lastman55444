import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useUserProfile } from "@/hooks/useUser";
import { useActivities } from "@/hooks/useActivities";
import StatCard from "@/components/dashboard/StatCard";
import ActivityTable from "@/components/dashboard/ActivityTable";

const Dashboard: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useUserProfile();
  const { data: activities, isLoading: isActivitiesLoading } = useActivities();
  
  // Calculate how many more referrals needed to get a free number
  const referralsNeeded = 20; // This would ideally come from settings API
  const currentReferrals = user?.referralCount || 0;
  const remainingReferrals = Math.max(0, referralsNeeded - currentReferrals);
  const referralProgress = Math.min(100, (currentReferrals / referralsNeeded) * 100);

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Referrals"
          value={isUserLoading ? "Loading..." : currentReferrals}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="primary"
          progress={{
            current: currentReferrals,
            total: referralsNeeded,
            label: `${currentReferrals}/${referralsNeeded} to earn a free number`,
          }}
        />
        
        <StatCard
          title="Numbers Purchased"
          value={isUserLoading ? "Loading..." : "0"}
          subtitle="Last purchase: Never"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          color="success"
        />
        
        <StatCard
          title="Account Balance"
          value={isUserLoading ? "Loading..." : `$${user?.balance.toFixed(2)}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="warning"
          actionLink={{
            text: "Add funds",
            url: "/store",
          }}
        />
        
        <StatCard
          title="KYC Status"
          value={isUserLoading ? "Loading..." : user?.kycStatus === "approved" ? "Verified" : "Pending"}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          color="primary"
          actionLink={{
            text: user?.kycStatus === "approved" ? "View details" : "Complete verification",
            url: "/kyc",
          }}
        />
      </div>
      
      {/* Recent Activity */}
      <ActivityTable 
        activities={activities || []} 
        isLoading={isActivitiesLoading} 
      />
    </DashboardLayout>
  );
};

export default Dashboard;
