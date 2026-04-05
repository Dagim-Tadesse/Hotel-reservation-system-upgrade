import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, BedDouble, CreditCard, Clock, Users, Star, MapPin, Phone, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";
import heroImg from "@/assets/hero-hotel.jpg";
import roomSingle from "@/assets/room-single.jpg";
import roomDouble from "@/assets/room-double.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

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

  const rooms = [
    { type: "Single Room", price: "$1,000", img: roomSingle, roomNumbers: "101 – 110", desc: "Cozy comfort for solo travelers with premium amenities and city views.", features: ["Queen Bed", "City View", "Free WiFi", "Room Service"] },
    { type: "Double Room", price: "$1,500", img: roomDouble, roomNumbers: "201 – 215", desc: "Spacious luxury for couples with elegant furnishings and a private balcony.", features: ["King Bed", "Balcony", "Mini Bar", "Spa Access"], featured: true },
    { type: "Suite", price: "$3,000", img: roomSuite, roomNumbers: "301 – 305", desc: "Ultimate indulgence with panoramic ocean views and butler service.", features: ["Living Room", "Panoramic View", "Butler Service", "Jacuzzi"] },
  ];

  const features = [
    { icon: BedDouble, title: "Room Management", desc: "Full CRUD operations with availability tracking and maintenance scheduling." },
    { icon: Users, title: "Guest Registry", desc: "Manage guest profiles, contact information, and booking history." },
    { icon: Clock, title: "Smart Bookings", desc: "Date validation, pricing calculations, and payment tracking." },
    { icon: CreditCard, title: "Billing System", desc: "Process payments with multiple methods and generate invoices." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden scroll-smooth">
      {/* Subtle animated grain / texture overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

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
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Reviews</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Features</a>
            {user ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCTA} className="text-sm bg-primary text-primary-foreground px-5 py-2 rounded-md hover:opacity-90 transition-opacity">
                {isAdmin ? "Dashboard" : "My Portal"}
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/login" className="text-sm bg-primary text-primary-foreground px-5 py-2 rounded-md hover:opacity-90 transition-opacity">Get Started</Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img src={heroImg} alt="Grand Horizon Hotel entrance at golden hour" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </motion.div>

        <motion.div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/8 rounded-full blur-[100px]"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-gold/10 border border-gold-light/30 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              <span className="text-xs tracking-widest uppercase text-gold-dark font-medium">Luxury Boutique Hotel</span>
            </motion.div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 text-foreground">
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="block">Where Elegance</motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="block text-gradient-gold">Meets Comfort</motion.span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
              Experience world-class hospitality. Browse rooms, book your stay, and manage everything from one elegant platform.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)" }} whileTap={{ scale: 0.97 }} onClick={handleCTA} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-md text-base font-medium shimmer-btn">
                {user ? (isAdmin ? "Go to Dashboard" : "Browse Rooms") : "Book Your Stay"} <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href="#rooms" className="inline-flex items-center gap-2 border border-border bg-background/60 backdrop-blur-sm text-foreground px-8 py-3.5 rounded-md text-base font-medium hover:bg-muted transition-colors">
                Explore Rooms
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Room Types */}
      <section id="rooms" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px]" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity }} />
          <motion.div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px]" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 12, repeat: Infinity }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-medium mb-4">Accommodations</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Our Room Collection</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div
                key={room.type}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className={`group bg-card border rounded-xl overflow-hidden transition-shadow duration-500 relative ${room.featured ? "border-gold ring-1 ring-gold/20 shadow-lg shadow-gold/10" : "border-border hover:shadow-xl"}`}
              >
                {room.featured && (
                  <div className="absolute top-4 right-4 z-20 bg-gold text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" /> POPULAR
                  </div>
                )}

                <div className="h-56 overflow-hidden relative">
                  <motion.img
                    src={room.img}
                    alt={room.type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={800}
                    height={640}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm border border-border px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-muted-foreground">Rooms {room.roomNumbers}</span>
                  </div>
                </div>

                <div className="p-6">
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
                    <Link to="/login" className="block w-full text-center bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                      Book Now
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-medium mb-4">System Features</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Complete Hotel Management</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, borderColor: "hsl(42 75% 55%)" }}
                className="p-6 border border-border rounded-xl bg-background hover:shadow-lg transition-all group"
              >
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
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
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Experience Luxury?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">Create an account today and book your perfect stay at Grand Horizon.</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-md text-lg font-medium hover:opacity-90 transition-opacity shimmer-btn">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <p className="font-serif text-2xl font-bold mb-4">Grand<span className="text-gold">Horizon</span></p>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">
                A premier luxury boutique hotel offering world-class accommodations and unparalleled hospitality since 2008.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4 text-sm tracking-widest uppercase text-gold">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#rooms" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">Our Rooms</a></li>
                <li><a href="#testimonials" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">Guest Reviews</a></li>
                <li><a href="#features" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">Features</a></li>
                <li><Link to="/login" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4 text-sm tracking-widest uppercase text-gold">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-primary-foreground/60">
                  <MapPin className="w-4 h-4 text-gold" /> 123 Oceanview Drive, Paradise Bay
                </li>
                <li className="flex items-center gap-2 text-sm text-primary-foreground/60">
                  <Phone className="w-4 h-4 text-gold" /> +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2 text-sm text-primary-foreground/60">
                  <Mail className="w-4 h-4 text-gold" /> hello@grandhorizon.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 text-center">
            <p className="text-xs text-primary-foreground/40">
              © 2023 Grand Horizon Hotel. Built with React, TypeScript & Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
