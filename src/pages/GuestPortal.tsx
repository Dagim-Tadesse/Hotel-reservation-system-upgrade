import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BedDouble, Calendar, Star, LogOut, Search, X, Check } from "lucide-react";
import { differenceInDays, format, parseISO } from "date-fns";
import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";
import { Link } from "react-router-dom";
import roomSingleImg from "@/assets/room-single.jpg";
import roomDoubleImg from "@/assets/room-double.jpg";
import roomSuiteImg from "@/assets/room-suite.jpg";

type Room = { id: string; room_number: string; room_type: string; room_price: number; is_available: boolean; is_under_maintenance: boolean };
type Booking = {
  id: string; room_id: string; check_in_date: string; check_out_date: string;
  total_price: number; is_paid: boolean; created_at: string;
  rooms?: { room_number: string; room_type: string; room_price: number } | null;
};

const roomImages: Record<string, string> = {
  single: roomSingleImg,
  double: roomDoubleImg,
  suite: roomSuiteImg,
};

const GuestPortal = () => {
  const { user, profile, signOut } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [roomRes, bookingRes] = await Promise.all([
      supabase.from("rooms").select("*").order("room_number"),
      supabase.from("bookings").select("*, rooms(room_number, room_type, room_price)").eq("guest_id", user?.id || "").order("created_at", { ascending: false }),
    ]);
    setRooms((roomRes.data as Room[]) || []);
    setBookings((bookingRes.data as Booking[]) || []);
  };

  const filteredRooms = rooms.filter((r) => {
    if (filter === "all") return !r.is_under_maintenance;
    return r.room_type === filter && !r.is_under_maintenance;
  });

  const handleBooking = async () => {
    if (!selectedRoom || !checkIn || !checkOut) { toast.error("Please fill all fields"); return; }
    const cin = parseISO(checkIn);
    const cout = parseISO(checkOut);
    if (cout <= cin) { toast.error("Check-out must be after check-in"); return; }
    const days = differenceInDays(cout, cin);
    const totalPrice = days * Number(selectedRoom.room_price);

    // First create the guest record if needed
    const guestName = profile?.full_name || user?.email || "Guest";
    const guestPhone = profile?.phone || "N/A";

    // Check if guest exists with this user's id
    let guestId = user?.id;

    // Try to find existing guest or create one
    const { data: existingGuest } = await supabase.from("guests").select("id").eq("id", user?.id || "").single();
    
    if (!existingGuest) {
      // Guest record won't be created due to RLS (admin only), so we use the user ID directly
      // The booking will use the auth user ID as guest_id
    }

    const { error } = await supabase.from("bookings").insert({
      guest_id: user?.id || "",
      room_id: selectedRoom.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: totalPrice,
    });

    if (error) { toast.error(error.message); return; }
    toast.success(`Room ${selectedRoom.room_number} booked for ${days} nights!`);
    setShowBookingModal(false);
    setSelectedRoom(null);
    setCheckIn("");
    setCheckOut("");
    loadData();
  };

  return (
    <AnimatedPage className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold">
            Grand<span className="text-gradient-gold">Horizon</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground capitalize">{profile?.full_name || user?.email}</span>
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl p-10 mb-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent" />
          <div className="relative z-10">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground mb-2">
              Find Your Perfect Room
            </h1>
            <p className="text-primary-foreground/80 max-w-lg">
              Browse our collection of luxury rooms and suites. Book your stay with just a few clicks.
            </p>
          </div>
          <motion.div
            className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-8">
          <Search className="w-4 h-4 text-muted-foreground" />
          {["all", "single", "double", "suite"].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {f === "all" ? "All Rooms" : f}
            </motion.button>
          ))}
        </div>

        {/* Room Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence>
            {filteredRooms.map((room) => (
              <StaggerItem key={room.id}>
                <motion.div
                  layout
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)" }}
                  className={`bg-card border rounded-xl overflow-hidden transition-all cursor-pointer ${
                    !room.is_available ? "opacity-60 border-border" : "border-border hover:border-gold-light"
                  }`}
                  onClick={() => {
                    if (room.is_available) {
                      setSelectedRoom(room);
                      setShowBookingModal(true);
                    }
                  }}
                >
                  {/* Room image area */}
                  <div className="h-44 bg-gradient-to-br from-muted via-accent to-muted flex items-center justify-center relative">
                    <span className="text-6xl">{roomImages[room.room_type] || "🏠"}</span>
                    <div className="absolute top-3 right-3">
                      {room.is_available ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Available</span>
                      ) : (
                        <span className="text-xs bg-destructive/10 text-destructive px-2.5 py-1 rounded-full font-medium">Occupied</span>
                      )}
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="text-xs bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-full capitalize font-medium">
                        {room.room_type}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-lg font-bold text-foreground">Room {room.room_number}</h3>
                      <div className="flex items-center gap-0.5">
                        {[...Array(room.room_type === "suite" ? 5 : room.room_type === "double" ? 4 : 3)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gold-dark font-bold text-xl font-serif">
                      ${Number(room.room_price).toLocaleString()}
                      <span className="text-sm text-muted-foreground font-normal font-sans">/night</span>
                    </p>
                    {room.is_available && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Book Now
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>

        {/* My Bookings */}
        {bookings.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-gold-dark" /> My Bookings
            </h2>
            <div className="space-y-3">
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-lg p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                      {roomImages[b.rooms?.room_type || "single"]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Room {b.rooms?.room_number} — <span className="capitalize">{b.rooms?.room_type}</span></p>
                      <p className="text-sm text-muted-foreground">{b.check_in_date} → {b.check_out_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground font-serif">${Number(b.total_price).toLocaleString()}</p>
                    {b.is_paid ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700"><Check className="w-3 h-3" /> Paid</span>
                    ) : (
                      <span className="text-xs text-destructive">Pending</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-bold text-foreground">Book Room {selectedRoom.room_number}</h3>
                <button onClick={() => setShowBookingModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{roomImages[selectedRoom.room_type]}</span>
                  <div>
                    <p className="font-medium capitalize text-foreground">{selectedRoom.room_type} Room</p>
                    <p className="text-gold-dark font-bold">${Number(selectedRoom.room_price).toLocaleString()}/night</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || format(new Date(), "yyyy-MM-dd")}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </div>

              {checkIn && checkOut && parseISO(checkOut) > parseISO(checkIn) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-gold/10 border border-gold-light/30 rounded-lg p-3 mb-4"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{differenceInDays(parseISO(checkOut), parseISO(checkIn))} night(s) × ${Number(selectedRoom.room_price).toLocaleString()}</span>
                    <span className="font-bold text-foreground font-serif">
                      ${(differenceInDays(parseISO(checkOut), parseISO(checkIn)) * Number(selectedRoom.room_price)).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleBooking}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <BedDouble className="w-4 h-4" /> Confirm Booking
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default GuestPortal;
