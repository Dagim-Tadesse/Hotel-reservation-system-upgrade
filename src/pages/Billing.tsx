import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Receipt, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

type Booking = {
  id: string; guest_id: string; room_id: string; check_in_date: string; check_out_date: string;
  total_price: number; is_paid: boolean;
  guests?: { name: string; phone_number: string } | null;
  rooms?: { room_number: string; room_type: string; room_price: number } | null;
};

const PAYMENT_METHODS = ["Cash", "Telebirr", "CBE", "Awash Bank", "BOA", "Dashen Bank"];

const Billing = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    const { data } = await supabase.from("bookings").select("*, guests(name, phone_number), rooms(room_number, room_type, room_price)").eq("is_paid", false).order("created_at", { ascending: false });
    setBookings((data as Booking[]) || []);
  };

  const handlePayment = async () => {
    if (!selected) return;
    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) { toast.error("Enter a valid amount"); return; }
    const newTotal = Number(selected.total_price) - payAmount;
    const isPaid = newTotal <= 0;

    await supabase.from("payment_reports").insert({
      booking_id: selected.id,
      guest_name: selected.guests?.name || "",
      phone_number: selected.guests?.phone_number || "",
      room_number: selected.rooms?.room_number || "",
      room_type: selected.rooms?.room_type || "",
      room_price: selected.rooms?.room_price || 0,
      check_in_date: selected.check_in_date,
      check_out_date: selected.check_out_date,
      amount_paid: payAmount,
      payment_method: method,
    });

    await supabase.from("bookings").update({ total_price: Math.max(0, newTotal), is_paid: isPaid }).eq("id", selected.id);
    toast.success(`Payment of $${payAmount.toLocaleString()} processed. ${isPaid ? "Fully paid!" : `Remaining: $${Math.max(0, newTotal).toLocaleString()}`}`);
    setSelected(null); setAmount(""); loadBookings();
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Billing & Payments</h1>
        <p className="text-muted-foreground mt-1">Process payments and generate invoices</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-xl font-semibold mb-4 text-foreground">Unpaid Bookings</h2>
          <div className="space-y-3">
            {bookings.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => { setSelected(b); setAmount(""); }}
                whileHover={{ scale: 1.01 }}
                className={`bg-card border rounded-xl p-5 cursor-pointer transition-all ${selected?.id === b.id ? "border-gold ring-2 ring-gold/20" : "border-border hover:border-gold-light"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize text-foreground">{b.guests?.name}</p>
                    <p className="text-sm text-muted-foreground">Room {b.rooms?.room_number} · {b.rooms?.room_type} · {b.check_in_date} → {b.check_out_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground font-serif">${Number(b.total_price).toLocaleString()}</p>
                    <p className="text-xs text-destructive">Outstanding</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {bookings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                All bookings are paid.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl font-semibold mb-4 text-foreground">Process Payment</h2>
          <motion.div layout className="bg-card border border-border rounded-xl p-6">
            {selected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Invoice for</p>
                  <p className="font-medium capitalize text-foreground">{selected.guests?.name}</p>
                  <p className="text-sm text-muted-foreground">Room {selected.rooms?.room_number} · {selected.rooms?.room_type}</p>
                  <p className="text-2xl font-bold mt-2 text-foreground font-serif">${Number(selected.total_price).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount to Pay</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                    placeholder={`Max $${Number(selected.total_price).toLocaleString()}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring">
                    {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handlePayment}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 inline-flex items-center justify-center gap-2">
                  <Receipt className="w-4 h-4" /> Process Payment
                </motion.button>
              </motion.div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">Select a booking to process payment</p>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
