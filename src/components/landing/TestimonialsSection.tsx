import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophia Laurent",
    role: "Business Traveler",
    quote: "An unforgettable experience. The suite was breathtaking, and the staff anticipated every need before I even asked.",
    rating: 5,
    initials: "SL",
  },
  {
    name: "James & Emily Chen",
    role: "Honeymoon Couple",
    quote: "Our honeymoon at Grand Horizon was pure magic. The balcony view at sunset alone was worth it. We'll be back every anniversary.",
    rating: 5,
    initials: "JC",
  },
  {
    name: "Robert Kimani",
    role: "Returning Guest",
    quote: "I've stayed at luxury hotels worldwide, and Grand Horizon consistently delivers five-star service with genuine warmth.",
    rating: 5,
    initials: "RK",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-gold-dark font-medium mb-4">
            Guest Reviews
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            What Our Guests Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="relative bg-card border border-border rounded-xl p-8 hover:shadow-xl transition-shadow duration-500 group"
            >
              {/* Decorative quote mark */}
              <div className="absolute top-4 right-6 font-serif text-7xl text-gold/10 leading-none select-none">
                "
              </div>

              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 italic relative z-10">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
