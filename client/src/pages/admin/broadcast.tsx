import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Broadcast from "@/components/admin/Broadcast";

const AdminBroadcastPage: React.FC = () => {
  return (
    <DashboardLayout title="Broadcast Message" adminMode={true}>
      <Broadcast />
    </DashboardLayout>
  );
};

export default AdminBroadcastPage;
