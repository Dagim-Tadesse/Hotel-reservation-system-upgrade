import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Rooms from "@/pages/Rooms";
import Guests from "@/pages/Guests";
import Bookings from "@/pages/Bookings";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/rooms" element={<Rooms />} />
        <Route path="/dashboard/guests" element={<Guests />} />
        <Route path="/dashboard/bookings" element={<Bookings />} />
        <Route path="/dashboard/billing" element={<Billing />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
