import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/AnimatedPage";

type Report = {
  id: string; guest_name: string; phone_number: string | null; room_number: string; room_type: string;
  room_price: number; check_in_date: string; check_out_date: string; amount_paid: number;
  payment_method: string; payment_date: string;
};

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [dailyTotal, setDailyTotal] = useState<number | null>(null);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    const { data } = await supabase.from("payment_reports").select("*").order("payment_date", { ascending: false });
    setReports((data as Report[]) || []);
  };

  const generateDailyReport = () => {
    if (!dateFilter) return;
    const dayReports = reports.filter((r) => r.payment_date.startsWith(dateFilter));
    const total = dayReports.reduce((sum, r) => sum + Number(r.amount_paid), 0);
    setDailyTotal(total);
    setDailyCount(dayReports.length);
  };

  const chartData = Object.entries(
    reports.reduce<Record<string, number>>((acc, r) => {
      const date = r.payment_date.split("T")[0];
      acc[date] = (acc[date] || 0) + Number(r.amount_paid);
      return acc;
    }, {})
  ).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);

  const totalRevenue = reports.reduce((sum, r) => sum + Number(r.amount_paid), 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Payment history, daily sales, and revenue analytics</p>
      </div>

      <StaggerContainer className="grid sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}` },
          { label: "Total Transactions", value: reports.length },
          { label: "Average Payment", value: `$${reports.length ? Math.round(totalRevenue / reports.length).toLocaleString() : 0}` },
        ].map((s) => (
          <StaggerItem key={s.label}>
            <motion.div whileHover={{ y: -3 }} className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold font-serif text-foreground">{s.value}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="font-serif text-xl font-semibold mb-4 text-foreground">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 85%)" />
              <XAxis dataKey="date" fontSize={12} stroke="hsl(220 10% 45%)" />
              <YAxis fontSize={12} stroke="hsl(220 10% 45%)" />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(42 75% 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="font-serif text-xl font-semibold mb-4 text-foreground">Daily Sales Report</h2>
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateDailyReport}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
            <CalendarDays className="w-4 h-4" /> Generate
          </motion.button>
          {dailyTotal !== null && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ml-4">
              <p className="text-sm text-muted-foreground">{dailyCount} transaction(s)</p>
              <p className="text-xl font-bold text-foreground font-serif">Total: ${dailyTotal.toLocaleString()}</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <h2 className="font-serif text-xl font-semibold p-6 pb-0 text-foreground">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full mt-4">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Guest</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Room</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Stay</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Method</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 capitalize text-foreground">{r.guest_name}</td>
                  <td className="px-6 py-4 text-foreground">{r.room_number} <span className="text-xs text-muted-foreground capitalize">({r.room_type})</span></td>
                  <td className="px-6 py-4 text-sm text-foreground">{r.check_in_date} → {r.check_out_date}</td>
                  <td className="px-6 py-4 font-medium text-foreground">${Number(r.amount_paid).toLocaleString()}</td>
                  <td className="px-6 py-4 text-foreground">{r.payment_method}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(r.payment_date).toLocaleString()}</td>
                </motion.tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No payment records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
