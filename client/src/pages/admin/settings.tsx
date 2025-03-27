import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SystemSettings from "@/components/admin/SystemSettings";

const AdminSettingsPage: React.FC = () => {
  return (
    <DashboardLayout title="System Settings" adminMode={true}>
      <SystemSettings />
    </DashboardLayout>
  );
};

export default AdminSettingsPage;
