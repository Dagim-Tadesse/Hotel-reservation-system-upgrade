import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { BedDouble, Users, CalendarDays, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/AnimatedPage";

const Dashboard = () => {
  const [stats, setStats] = useState({ rooms: 0, guests: 0, bookings: 0, revenue: 0, available: 0, occupied: 0 });

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    const [roomsRes, guestsRes, bookingsRes, reportsRes] = await Promise.all([
      supabase.from("rooms").select("*"),
      supabase.from("guests").select("id"),
      supabase.from("bookings").select("*"),
      supabase.from("payment_reports").select("amount_paid"),
    ]);

    const rooms = roomsRes.data || [];
    const revenue = (reportsRes.data || []).reduce((sum, r) => sum + Number(r.amount_paid), 0);

    setStats({
      rooms: rooms.length,
      guests: (guestsRes.data || []).length,
      bookings: (bookingsRes.data || []).length,
      revenue,
      available: rooms.filter((r) => r.is_available && !r.is_under_maintenance).length,
      occupied: rooms.filter((r) => !r.is_available).length,
    });
  };

  const cards = [
    { icon: BedDouble, label: "Total Rooms", value: stats.rooms, sub: `${stats.available} available · ${stats.occupied} occupied`, color: "text-blue-500" },
    { icon: Users, label: "Guests", value: stats.guests, sub: "Registered guests", color: "text-emerald-500" },
    { icon: CalendarDays, label: "Bookings", value: stats.bookings, sub: "Total bookings", color: "text-purple-500" },
    { icon: DollarSign, label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, sub: "Total collected", color: "text-gold-dark" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your hotel operations</p>
      </div>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <StaggerItem key={c.label}>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
              className="bg-card border border-border rounded-xl p-6 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-medium">{c.label}</span>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground font-serif">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </DashboardLayout>
  );
};

export default Dashboard;
