import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Guest = { id: string; name: string; phone_number: string; email: string | null; created_at: string };

const Guests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [form, setForm] = useState({ name: "", phone_number: "", email: "" });

  useEffect(() => { loadGuests(); }, []);

  const loadGuests = async () => {
    const { data } = await supabase.from("guests").select("*").order("name");
    setGuests((data as Guest[]) || []);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone_number.trim()) { toast.error("Name and phone required"); return; }
    const payload = { name: form.name.toLowerCase(), phone_number: form.phone_number, email: form.email || null };
    if (editGuest) {
      const { error } = await supabase.from("guests").update(payload).eq("id", editGuest.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Guest updated");
    } else {
      const { error } = await supabase.from("guests").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Guest added");
    }
    setShowForm(false); setEditGuest(null); setForm({ name: "", phone_number: "", email: "" }); loadGuests();
  };

  const handleDelete = async (guest: Guest) => {
    if (!confirm(`Delete guest ${guest.name}?`)) return;
    await supabase.from("guests").delete().eq("id", guest.id);
    toast.success("Guest deleted"); loadGuests();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Guest Management</h1>
          <p className="text-muted-foreground mt-1">Manage guest profiles and contact information</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setShowForm(true); setEditGuest(null); setForm({ name: "", phone_number: "", email: "" }); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Guest
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-serif text-xl font-bold mb-4">{editGuest ? "Edit Guest" : "Add New Guest"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="0912345678" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email (optional)</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="guest@email.com" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90">Save</button>
                  <button onClick={() => setShowForm(false)} className="flex-1 border border-border py-2 rounded-md text-sm font-medium hover:bg-muted">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Phone</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g, i) => (
                <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium capitalize text-foreground">{g.name}</td>
                  <td className="px-6 py-4 text-foreground">{g.phone_number}</td>
                  <td className="px-6 py-4 text-muted-foreground">{g.email || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditGuest(g); setForm({ name: g.name, phone_number: g.phone_number, email: g.email || "" }); setShowForm(true); }}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(g)}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {guests.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-muted-foreground">No guests registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Guests;
