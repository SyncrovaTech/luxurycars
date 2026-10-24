import api from "./axios";

export interface DashboardActivity {
  id: string;
  type: "TEST_DRIVE" | "QUOTATION";
  title: string;
  description: string;
  customer: string;
  status: string;
  date: string;
  details: string;
  createdAt: string | null;
}

export interface SuperAdminDashboardData {
  dashboard: string;
  message: string;

  metrics: {
    users: {
      total: number;
      active: number;
      inactive: number;
      customers: number;
      managers: number;
      admins: number;
      superAdmins: number;
    };

    cars: {
      total: number;
      stock: number;
      active: number;
      inactive: number;
      featured: number;
      totalStock: number;
    };

    showrooms: {
      total: number;
      active: number;
      inactive: number;
    };

    testDrives: {
      total: number;
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
    };

    quotations: {
      total: number;
      pending: number;
      underReview: number;
      approved: number;
      rejected: number;
      expired: number;
    };
  };

  recentActivity: DashboardActivity[];
  permissions: Record<string, boolean>;
}

export interface DashboardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getCustomerDashboard = () =>
  api.get("/dashboard/customer");

export const getManagerDashboard = () =>
  api.get("/dashboard/manager");

export const getAdminDashboard = () =>
  api.get("/dashboard/admin");

export const getSuperAdminDashboard = () =>
  api.get<DashboardApiResponse<SuperAdminDashboardData>>(
    "/dashboard/super-admin"
  );