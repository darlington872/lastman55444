import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import UserManagement from "@/components/admin/UserManagement";

const AdminUsersPage: React.FC = () => {
  return (
    <DashboardLayout title="User Management" adminMode={true}>
      <UserManagement />
    </DashboardLayout>
  );
};

export default AdminUsersPage;
