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
        <div className="mr-4 h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (isPending) {
      return (
        <div className="mr-4 h-12 w-12 flex items-center justify-center rounded-full bg-warning-100 text-warning-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="mr-4 h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <Card className="bg-white rounded-lg shadow p-6 mb-6">
        <CardContent className="p-0">
          <div className="flex items-center">
            {renderStatusIcon()}
            <div>
              <h2 className="text-lg font-medium text-gray-800">Verification Status</h2>
              <p className={`font-medium ${
                isVerified ? "text-green-500" : isPending ? "text-warning-500" : "text-red-500"
              }`}>
                {getStatusText()}
              </p>
              <p className="text-sm text-gray-500 mt-1">{getStatusDescription()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* KYC Form or Status Message */}
      {isUserLoading || isKycLoading ? (
        <div className="flex justify-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-primary-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : isVerified ? (
        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Verification Successful</h3>
              <p className="text-gray-600 mb-6">
                Your identity has been verified. You are now eligible to claim referral rewards.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : kyc && isPending ? (
        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-warning-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Verification In Progress</h3>
              <p className="text-gray-600 mb-6">
                Your documents have been submitted and are pending review. This typically takes 1-2 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Submit Verification Documents</h2>
            <KycForm />
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default KycPage;
