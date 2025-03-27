import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import StockManagement from "@/components/admin/StockManagement";

const AdminStockPage: React.FC = () => {
  return (
    <DashboardLayout title="Stock Management" adminMode={true}>
      <StockManagement />
    </DashboardLayout>
  );
};

export default AdminStockPage;
