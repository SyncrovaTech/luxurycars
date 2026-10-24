//D:\D-Luxury-Car-Showroom\Frontend\src\app\routes.tsx
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "../auth/ProtectedRoute";

import Home from "../pages/home/Home";
import Services from "../pages/home/Services";
import About from "../pages/home/About";
import Contact from "../pages/home/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import UserManagement from "../pages/super-admin/UserManagement";
import UserDetails from "../pages/super-admin/UserDetails";

import CarManagement from "../pages/admin/CarManagement";

import CarCollection from "../pages/cars/CarCollection";
import CarRecommendation from "../pages/cars/CarRecommendation";
import CarConfigurator from "../pages/configurator/CarConfigurator";
import ShowroomManagement from "../pages/super-admin/showrooms/ShowroomManagement";
import QuotationManagement from "../pages/admin/QuotationManagement";

function Unauthorized() {
  return (
    <div className="simple-page">
      <h1>403</h1>

      <p>
        You are not authorized to access this page.
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* =========================================
          PUBLIC ROUTES
      ========================================= */}

      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route
        path="/cars"
        element={<CarCollection />}
      />

      <Route
        path="/car-recommendations"
        element={<CarRecommendation />}
      />

      <Route
        path="/cars/:slug/configure"
        element={<CarConfigurator />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* =========================================
          CUSTOMER ROUTES
          Customer and Super Admin
      ========================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["CUSTOMER"]}
          />
        }
      >
        <Route
          path="/customer"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/configurations"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/test-drives"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/quotations"
          element={<CustomerDashboard />}
        />
      </Route>

      {/* =========================================
          MANAGER ROUTES
          Manager and Super Admin
      ========================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["MANAGER"]}
          />
        }
      >
        <Route
          path="/manager"
          element={<ManagerDashboard />}
        />

        <Route
          path="/manager/dashboard"
          element={<ManagerDashboard />}
        />
      </Route>

      {/* =========================================
          ADMIN ROUTES
          Admin and Super Admin
      ========================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN", "SUPER_ADMIN"]}
          />
        }
      >
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/cars"
          element={<CarManagement />}
        />

        <Route
          path="/admin/quotations"
          element={<QuotationManagement />}
        />
      </Route>

      {/* =========================================
          SUPER ADMIN ROUTES
          Super Admin only
      ========================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["SUPER_ADMIN"]}
          />
        }
      >
        <Route
          path="/super-admin"
          element={<SuperAdminDashboard />}
        />

        <Route
          path="/super-admin/dashboard"
          element={<SuperAdminDashboard />}
        />

        <Route
          path="/super-admin/users"
          element={<UserManagement />}
        />

        <Route
          path="/super-admin/users/:id"
          element={<UserDetails />}
        />

        <Route
          path="/super-admin/showrooms"
          element={<ShowroomManagement />}
        />

      </Route>

      {/* =========================================
          404
      ========================================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
