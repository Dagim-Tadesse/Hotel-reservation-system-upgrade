import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Shield, Clock, Users, Sparkles, BedDouble, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";

const Landing = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleCTA = () => {
    if (user) {
      navigate(isAdmin ? "/dashboard" : "/guest");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Grand<span className="text-gradient-gold">Horizon</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#rooms" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Rooms</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Features</a>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCTA}
                className="text-sm bg-primary text-primary-foreground px-5 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                {isAdmin ? "Dashboard" : "My Portal"}
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="text-sm bg-primary text-primary-foreground px-5 py-2 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/8 rounded-full blur-[100px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold-light/30 px-4 py-1.5 rounded-full mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              <span className="text-xs tracking-widest uppercase text-gold-dark font-medium">Luxury Boutique Hotel</span>
            </motion.div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 text-foreground">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                Where Elegance
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-gradient-gold"
              >
                Meets Comfort
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light"
            >
              Experience world-class hospitality. Browse rooms, book your stay, and manage everything from one elegant platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCTA}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-md text-base font-medium"
              >
                {user ? (isAdmin ? "Go to Dashboard" : "Browse Rooms") : "Book Your Stay"} <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#rooms"
                className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-md text-base font-medium hover:bg-muted transition-colors"
              >
                Explore Rooms
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-gold rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Room Types */}
      <section id="rooms" className="py-24 bg-card relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-medium mb-4">Accommodations</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Our Room Collection</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { type: "Single Room", price: "$1,000", icon: "🛏️", desc: "Cozy comfort for solo travelers with premium amenities.", features: ["Queen Bed", "City View", "Free WiFi", "Room Service"] },
              { type: "Double Room", price: "$1,500", icon: "🏨", desc: "Spacious luxury for couples with elegant furnishings.", features: ["King Bed", "Balcony", "Mini Bar", "Spa Access"], featured: true },
              { type: "Suite", price: "$3,000", icon: "👑", desc: "Ultimate indulgence with panoramic views.", features: ["Living Room", "Panoramic View", "Butler Service", "Jacuzzi"] },
            ].map((room, i) => (
              <motion.div
                key={room.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
                className={`bg-background border rounded-xl p-8 transition-all relative ${
                  room.featured ? "border-gold ring-1 ring-gold/20" : "border-border"
                }`}
              >
                {room.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary px-3 py-0.5 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}
                <div className="h-48 bg-gradient-to-br from-muted to-accent rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-6xl">{room.icon}</span>
                </div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-serif text-xl font-semibold text-foreground">{room.type}</h3>
                  <span className="font-sans text-gold-dark font-bold text-lg">{room.price}<span className="text-sm text-muted-foreground font-normal">/night</span></span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{room.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {room.features.map((f) => (
                    <span key={f} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">{f}</span>
                  ))}
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="block w-full text-center bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Book Now
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-medium mb-4">System Features</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Complete Hotel Management</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BedDouble, title: "Room Management", desc: "Full CRUD operations with availability tracking and maintenance scheduling." },
              { icon: Users, title: "Guest Registry", desc: "Manage guest profiles, contact information, and booking history." },
              { icon: Clock, title: "Smart Bookings", desc: "Date validation, pricing calculations, and payment tracking." },
              { icon: CreditCard, title: "Billing System", desc: "Process payments with multiple methods and generate invoices." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, borderColor: "hsl(42 75% 55%)" }}
                className="p-6 border border-border rounded-xl hover:bg-card transition-all group"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <f.icon className="w-8 h-8 text-gold-dark mb-4 group-hover:scale-110 transition-transform" />
                </motion.div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Experience Luxury?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Create an account today and book your perfect stay at Grand Horizon.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-md text-lg font-medium hover:opacity-90 transition-opacity"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-serif text-xl font-bold mb-2">
            Grand<span className="text-gradient-gold">Horizon</span>
          </p>
          <p className="text-sm text-muted-foreground">
            A full-stack hotel management system built with React, TypeScript & Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
