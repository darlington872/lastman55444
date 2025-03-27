import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAdminOrders } from "@/hooks/useOrders";
import { useAdminPayments } from "@/hooks/usePayments";
import { useAdminPhoneNumbers } from "@/hooks/usePhoneNumbers";
import { useAdminKyc, useUpdateKyc } from "@/hooks/useKyc";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  linkHref?: string;
  linkText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  linkHref,
  linkText,
}) => (
  <Card className="bg-black border border-purple-900/20">
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-purple-900/30 text-purple-400">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-purple-300 font-medium">{title}</p>
          <p className="text-xl font-semibold text-white">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-purple-300/80">{subtext}</p>
        {linkHref && linkText && (
          <Link href={linkHref}>
            <a className="text-sm text-purple-400 hover:text-purple-300 flex items-center mt-1">
              {linkText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 inline ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Link>
        )}
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();
  const { data: pendingPayments, isLoading: paymentsLoading } = useAdminPayments(true);
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } = useAdminPhoneNumbers();
  const { data: pendingKyc, isLoading: kycLoading } = useAdminKyc(true);
  const updateKycMutation = useUpdateKyc();

  const isLoading = ordersLoading || paymentsLoading || phoneNumbersLoading || kycLoading;

  const totalUsers = orders?.reduce((acc, order) => {
    const userIds = acc.userIds || new Set();
    userIds.add(order.userId);
    acc.userIds = userIds;
    acc.count = userIds.size;
    return acc;
  }, { count: 0, userIds: new Set<number>() })?.count || 0;

  const availableStock = phoneNumbers?.filter(pn => pn.isAvailable)?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingActionsCount = (pendingPayments?.length || 0) + (pendingKyc?.length || 0);

  // Recent orders calculation
  const recentOrders = [...(orders || [])]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Users"
          value={isLoading ? "Loading..." : totalUsers}
          subtext="Registered users"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          linkHref="/admin/users"
          linkText="View all users"
        />

        <StatCard
          title="Total Orders"
          value={isLoading ? "Loading..." : totalOrders}
          subtext="Orders processed"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
        />

        <StatCard
          title="Available Stock"
          value={isLoading ? "Loading..." : availableStock}
          subtext="WhatsApp numbers available"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          }
          linkHref="/admin/stock"
          linkText="Manage stock"
        />

        <StatCard
          title="Pending Actions"
          value={isLoading ? "Loading..." : pendingActionsCount}
          subtext="Items requiring attention"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
          linkHref="/admin/payments"
          linkText="Review pending"
        />
      </div>

      {/* Recent Orders */}
      <Card className="mb-6 bg-black border border-purple-900/20">
        <CardHeader className="px-6 py-4 border-b border-purple-900/40 flex justify-between items-center">
          <CardTitle className="text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-400 text-transparent bg-clip-text">Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <a className="text-sm text-purple-400 hover:text-purple-500">View all</a>
          </Link>
        </CardHeader>
        <CardContent className="px-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-purple-500"
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
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-purple-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-900/20">
                <thead className="bg-black/80">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      User ID
                    </th>
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
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-purple-900/20">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          User #{order.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "completed"
                              ? "bg-green-900/40 text-green-400 border border-green-500/20"
                              : order.status === "pending"
                              ? "bg-yellow-900/40 text-yellow-400 border border-yellow-500/20"
                              : "bg-red-900/40 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="link" size="sm" className="text-purple-400 hover:text-purple-300">
                          Process
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending KYC */}
      <Card className="bg-black border border-purple-900/20">
        <CardHeader className="px-6 py-4 border-b border-purple-900/40 flex justify-between items-center">
          <CardTitle className="text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-400 text-transparent bg-clip-text">Pending KYC Verifications</CardTitle>
          <Link href="/admin/kyc">
            <a className="text-sm text-purple-400 hover:text-purple-500">View all</a>
          </Link>
        </CardHeader>
        <CardContent className="px-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-purple-500"
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
          ) : !pendingKyc || pendingKyc.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-purple-400">No pending KYC verifications</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-900/20">
                <thead className="bg-black/80">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      User ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Full Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Submission Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-purple-900/20">
                  {pendingKyc.slice(0, 5).map((kyc) => (
                    <tr key={kyc.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">
                        #{kyc.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {kyc.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                        {kyc.createdAt ? new Date(kyc.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-900 text-green-400 border border-green-500/30 hover:bg-green-800 hover:text-green-300"
                            onClick={() => updateKycMutation.mutate({ kycId: kyc.id, status: "approved" })}
                            disabled={updateKycMutation.isPending}
                          >
                            {updateKycMutation.isPending ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-900 text-red-400 border border-red-500/30 hover:bg-red-800 hover:text-red-300"
                            onClick={() => updateKycMutation.mutate({ kycId: kyc.id, status: "rejected" })}
                            disabled={updateKycMutation.isPending}
                          >
                            {updateKycMutation.isPending ? 'Processing...' : 'Reject'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AdminDashboard;
