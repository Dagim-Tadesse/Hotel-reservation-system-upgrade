import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Rooms from "@/pages/Rooms";
import Guests from "@/pages/Guests";
import Bookings from "@/pages/Bookings";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import GuestPortal from "@/pages/GuestPortal";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest" element={<ProtectedRoute><GuestPortal /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/rooms" element={<ProtectedRoute adminOnly><Rooms /></ProtectedRoute>} />
        <Route path="/dashboard/guests" element={<ProtectedRoute adminOnly><Guests /></ProtectedRoute>} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute adminOnly><Bookings /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute adminOnly><Billing /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
