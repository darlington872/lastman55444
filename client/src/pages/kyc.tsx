import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useUserProfile } from "@/hooks/useUser";
import { useKyc } from "@/hooks/useKyc";
import KycForm from "@/components/kyc/KycForm";
import { Card, CardContent } from "@/components/ui/card";

const KycPage: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useUserProfile();
  const { data: kyc, isLoading: isKycLoading } = useKyc();
  
  // Determine the KYC status
  const kycStatus = kyc ? kyc.status : (user?.kycStatus || "pending");
  const isVerified = kycStatus === "approved";
  const isPending = kycStatus === "pending";
  const isRejected = kycStatus === "rejected";
  
  const renderStatusIcon = () => {
    if (isVerified) {
      return (
        <div className="mr-4 h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/90 to-emerald-600/90 text-white shadow-lg shadow-green-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (isPending) {
      return (
        <div className="mr-4 h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500/90 to-orange-600/90 text-white shadow-lg shadow-amber-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="mr-4 h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500/90 to-pink-600/90 text-white shadow-lg shadow-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }
  };

  const getStatusText = () => {
    if (isVerified) {
      return "Verification Completed";
    } else if (isPending) {
      return "Pending Verification";
    } else {
      return "Verification Rejected";
    }
  };

  const getStatusDescription = () => {
    if (isVerified) {
      return "Your identity has been verified. You can now claim referral rewards.";
    } else if (isPending) {
      return "KYC verification is required to claim referral rewards.";
    } else {
      return "Your verification was rejected. Please submit the correct documents.";
    }
  };

  return (
    <DashboardLayout title="KYC Verification">
      {/* KYC Status */}
      <div className="vibrant-card-alt p-6 mb-6 relative overflow-hidden">
        <div className="flex items-center relative z-10">
          {renderStatusIcon()}
          <div>
            <h2 className="text-lg font-bold text-white">Verification Status</h2>
            <p className={`text-xl font-bold mt-1 ${
              isVerified 
                ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500" 
                : isPending 
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500" 
                  : "text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500"
            }`}>
              {getStatusText()}
            </p>
            <p className="text-sm text-purple-300 mt-2">{getStatusDescription()}</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
      </div>
      
      {/* KYC Form or Status Message */}
      {isUserLoading || isKycLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-t-2 border-r-2 border-pink-500 animate-spin"></div>
            <div className="absolute inset-6 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin"></div>
          </div>
        </div>
      ) : isVerified ? (
        <div className="vibrant-card overflow-hidden relative">
          <div className="p-6 relative z-10">
            <div className="text-center py-10">
              <div className="h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-green-500/90 to-emerald-600/90 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 rainbow-text">Verification Successful</h3>
              <p className="text-purple-300 mb-6 max-w-md mx-auto">
                Your identity has been verified. You are now eligible to claim referral rewards from the users you invite.
              </p>
              
              {/* Animated success indicator */}
              <div className="w-24 h-3 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full relative overflow-hidden mt-4">
                <div className="absolute inset-y-0 left-0 w-1/5 bg-white/30 blur-sm animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>
      ) : kyc && isPending ? (
        <div className="vibrant-card overflow-hidden relative">
          <div className="p-6 relative z-10">
            <div className="text-center py-10">
              <div className="h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-amber-500/90 to-orange-600/90 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 neon-text">Verification In Progress</h3>
              <p className="text-purple-300 mb-4 max-w-md mx-auto">
                Your documents have been submitted and are pending review. This typically takes 1-2 business days.
              </p>
              
              {/* Animated loading indicator */}
              <div className="w-48 h-2 mx-auto bg-gray-800 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 w-1/3 animate-pulse"></div>
              </div>
              <p className="text-xs text-purple-400/70 mt-2">Processing your verification</p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
        </div>
      ) : (
        <div className="vibrant-card overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-900/20 flex items-center justify-between">
            <h2 className="text-lg font-bold vibrant-gradient-text flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Submit Verification Documents
            </h2>
          </div>
          <div className="p-6">
            <KycForm />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default KycPage;
