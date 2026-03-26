import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Clock, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Grand<span className="text-gradient-gold">Horizon</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#rooms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rooms</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <Link
              to="/login"
              className="text-sm bg-primary text-primary-foreground px-5 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-gold/5" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-sans font-medium mb-6">
              Luxury Boutique Hotel
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 text-foreground">
              Where Elegance
              <br />
              <span className="text-gradient-gold">Meets Comfort</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
              Experience world-class hospitality with our comprehensive hotel management system.
              Seamlessly manage rooms, guests, bookings, and finances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-md text-base font-medium hover:opacity-90 transition-opacity"
              >
                Access Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#rooms"
                className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-md text-base font-medium hover:bg-muted transition-colors"
              >
                Explore Rooms
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Room Types */}
      <section id="rooms" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-medium mb-4">
              Accommodations
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Our Room Collection
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                type: "Single Room",
                price: "$1,000",
                desc: "Cozy comfort for solo travelers with premium amenities and city views.",
                features: ["Queen Bed", "City View", "Free WiFi", "Room Service"],
              },
              {
                type: "Double Room",
                price: "$1,500",
                desc: "Spacious luxury for couples with elegant furnishings and balcony access.",
                features: ["King Bed", "Balcony", "Mini Bar", "Spa Access"],
              },
              {
                type: "Suite",
                price: "$3,000",
                desc: "Ultimate indulgence with separate living area and panoramic views.",
                features: ["Living Room", "Panoramic View", "Butler Service", "Jacuzzi"],
              },
            ].map((room, i) => (
              <motion.div
                key={room.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-background border border-border rounded-lg p-8 hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-muted to-accent rounded-md mb-6 flex items-center justify-center">
                  <span className="font-serif text-3xl text-muted-foreground/50">{room.type}</span>
                </div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-serif text-xl font-semibold text-foreground">{room.type}</h3>
                  <span className="font-sans text-gold-dark font-bold text-lg">{room.price}<span className="text-sm text-muted-foreground font-normal">/night</span></span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{room.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {room.features.map((f) => (
                    <span key={f} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-medium mb-4">
              System Features
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Complete Hotel Management
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Room Management", desc: "Full CRUD operations with availability tracking and maintenance scheduling." },
              { icon: Users, title: "Guest Registry", desc: "Manage guest profiles, contact information, and booking history." },
              { icon: Clock, title: "Smart Bookings", desc: "Date validation, pricing calculations, and payment status tracking." },
              { icon: Star, title: "Reports & Analytics", desc: "Daily sales reports, payment history, and revenue analytics." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 border border-border rounded-lg hover:bg-card transition-colors"
              >
                <f.icon className="w-8 h-8 text-gold-dark mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
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
