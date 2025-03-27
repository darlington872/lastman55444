import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import PaymentVerification from "@/components/admin/PaymentVerification";

const AdminPaymentsPage: React.FC = () => {
  return (
    <DashboardLayout title="Payment Verification" adminMode={true}>
      <PaymentVerification />
    </DashboardLayout>
  );
};

export default AdminPaymentsPage;
