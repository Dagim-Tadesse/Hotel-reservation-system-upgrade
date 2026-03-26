import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import { differenceInDays, format, parseISO } from "date-fns";

type Room = { id: string; room_number: string; room_type: string; room_price: number; is_available: boolean; is_under_maintenance: boolean };
type Guest = { id: string; name: string; phone_number: string };
type Booking = {
  id: string; guest_id: string; room_id: string; check_in_date: string; check_out_date: string;
  total_price: number; is_paid: boolean; created_at: string;
  guests?: { name: string; phone_number: string } | null;
  rooms?: { room_number: string; room_type: string; room_price: number } | null;
};

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ guest_id: "", room_id: "", check_in_date: "", check_out_date: "" });

  useEffect(() => {
    if (!localStorage.getItem("hotel_admin")) { navigate("/login"); return; }
    loadData();
  }, []);

  const loadData = async () => {
    const [bRes, rRes, gRes] = await Promise.all([
      supabase.from("bookings").select("*, guests(name, phone_number), rooms(room_number, room_type, room_price)").order("created_at", { ascending: false }),
      supabase.from("rooms").select("*").order("room_number"),
      supabase.from("guests").select("*").order("name"),
    ]);
    setBookings((bRes.data as Booking[]) || []);
    setRooms((rRes.data as Room[]) || []);
    setGuests((gRes.data as Guest[]) || []);
  };

  const handleAdd = async () => {
    if (!form.guest_id || !form.room_id || !form.check_in_date || !form.check_out_date) {
      toast.error("All fields required"); return;
    }
    const checkIn = parseISO(form.check_in_date);
    const checkOut = parseISO(form.check_out_date);
    if (checkOut <= checkIn) { toast.error("Check-out must be after check-in"); return; }

    const days = differenceInDays(checkOut, checkIn);
    const room = rooms.find((r) => r.id === form.room_id);
    if (!room) { toast.error("Room not found"); return; }
    const totalPrice = days * Number(room.room_price);

    const { error } = await supabase.from("bookings").insert({
      guest_id: form.guest_id, room_id: form.room_id,
      check_in_date: form.check_in_date, check_out_date: form.check_out_date,
      total_price: totalPrice,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Booking created");
    setShowForm(false);
    setForm({ guest_id: "", room_id: "", check_in_date: "", check_out_date: "" });
    loadData();
  };

  const handleDelete = async (booking: Booking) => {
    if (!confirm("Delete this booking?")) return;
    await supabase.from("bookings").delete().eq("id", booking.id);
    toast.success("Booking deleted");
    loadData();
  };

  const togglePaid = async (booking: Booking) => {
    await supabase.from("bookings").update({ is_paid: !booking.is_paid }).eq("id", booking.id);
    toast.success(booking.is_paid ? "Marked as unpaid" : "Marked as paid");
    loadData();
  };

  const availableRooms = rooms.filter((r) => r.is_available && !r.is_under_maintenance);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage guest bookings</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold mb-4">New Booking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Guest</label>
                <select value={form.guest_id} onChange={(e) => setForm({ ...form, guest_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select guest</option>
                  {guests.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <select value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select room</option>
                  {availableRooms.map((r) => <option key={r.id} value={r.id}>{r.room_number} — {r.room_type} (${Number(r.room_price).toLocaleString()}/night)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in</label>
                  <input type="date" value={form.check_in_date} onChange={(e) => setForm({ ...form, check_in_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check-out</label>
                  <input type="date" value={form.check_out_date} onChange={(e) => setForm({ ...form, check_out_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90">Create Booking</button>
                <button onClick={() => setShowForm(false)} className="flex-1 border border-border py-2 rounded-md text-sm font-medium hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Guest</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Room</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Check-in</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Check-out</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium capitalize text-foreground">{b.guests?.name || "—"}</td>
                  <td className="px-6 py-4 text-foreground">{b.rooms?.room_number || "—"} <span className="text-muted-foreground text-xs capitalize">({b.rooms?.room_type})</span></td>
                  <td className="px-6 py-4 text-foreground">{b.check_in_date}</td>
                  <td className="px-6 py-4 text-foreground">{b.check_out_date}</td>
                  <td className="px-6 py-4 font-medium text-foreground">${Number(b.total_price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {b.is_paid ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Paid</span>
                    ) : (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">Unpaid</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePaid(b)} title={b.is_paid ? "Mark unpaid" : "Mark paid"}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground">
                        {b.is_paid ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(b)}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Bookings;
