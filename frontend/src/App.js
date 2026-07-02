import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/api";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Packages = lazy(() => import("@/pages/Packages"));
const PackageDetail = lazy(() => import("@/pages/PackageDetail"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminLeadsPage = lazy(() => import("@/pages/admin/AdminLeadsPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));

import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
        <Routes>
            {/* Public site */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/packages/:slug" element={<PackageDetail />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeadsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
         </Routes>
</Suspense>
</BrowserRouter>
      </AuthProvider>
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App;
