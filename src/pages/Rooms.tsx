import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";

type Room = {
  id: string;
  room_number: string;
  room_type: string;
  room_price: number;
  is_available: boolean;
  is_under_maintenance: boolean;
};

const ROOM_PRICES: Record<string, number> = { single: 1000, double: 1500, suite: 3000 };

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [form, setForm] = useState({ room_number: "", room_type: "single" });

  useEffect(() => {
    if (!localStorage.getItem("hotel_admin")) { navigate("/login"); return; }
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const { data } = await supabase.from("rooms").select("*").order("room_number");
    setRooms((data as Room[]) || []);
  };

  const handleSave = async () => {
    const price = ROOM_PRICES[form.room_type] || 1000;
    if (!form.room_number.trim()) { toast.error("Room number required"); return; }

    if (editRoom) {
      const { error } = await supabase.from("rooms").update({ room_number: form.room_number, room_type: form.room_type, room_price: price }).eq("id", editRoom.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Room updated");
    } else {
      const { error } = await supabase.from("rooms").insert({ room_number: form.room_number, room_type: form.room_type, room_price: price });
      if (error) { toast.error(error.message); return; }
      toast.success("Room added");
    }
    setShowForm(false);
    setEditRoom(null);
    setForm({ room_number: "", room_type: "single" });
    loadRooms();
  };

  const handleDelete = async (room: Room) => {
    if (!confirm(`Delete room ${room.room_number}?`)) return;
    await supabase.from("rooms").delete().eq("id", room.id);
    toast.success("Room deleted");
    loadRooms();
  };

  const toggleMaintenance = async (room: Room) => {
    await supabase.from("rooms").update({ is_under_maintenance: !room.is_under_maintenance }).eq("id", room.id);
    toast.success(room.is_under_maintenance ? "Room back in service" : "Room set to maintenance");
    loadRooms();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage hotel rooms, types and availability</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditRoom(null); setForm({ room_number: "", room_type: "single" }); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold mb-4">{editRoom ? "Edit Room" : "Add New Room"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Number</label>
                <input value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. 101" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room Type</label>
                <select value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring">
                  <option value="single">Single — $1,000/night</option>
                  <option value="double">Double — $1,500/night</option>
                  <option value="suite">Suite — $3,000/night</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90">Save</button>
                <button onClick={() => setShowForm(false)} className="flex-1 border border-border py-2 rounded-md text-sm font-medium hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Room #</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Type</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Price/Night</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{room.room_number}</td>
                  <td className="px-6 py-4 capitalize text-foreground">{room.room_type}</td>
                  <td className="px-6 py-4 text-foreground">${Number(room.room_price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {room.is_under_maintenance ? (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">Maintenance</span>
                    ) : room.is_available ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Available</span>
                    ) : (
                      <span className="text-xs bg-gold-light/30 text-gold-dark px-2 py-1 rounded-full">Occupied</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditRoom(room); setForm({ room_number: room.room_number, room_type: room.room_type }); setShowForm(true); }}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => toggleMaintenance(room)}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"><Wrench className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(room)}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No rooms yet. Add your first room to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
