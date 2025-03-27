import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminDashboardPage: React.FC = () => {
  return (
    <DashboardLayout title="Admin Dashboard" adminMode={true}>
      <AdminDashboard />
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
