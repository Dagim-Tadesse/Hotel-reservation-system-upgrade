import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 500, suffix: "+", label: "Happy Guests" },
  { value: 50, suffix: "", label: "Luxury Rooms" },
  { value: 4.9, suffix: "", label: "Average Rating", decimal: true },
  { value: 15, suffix: "+", label: "Years of Service" },
];

export default function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--gold) / 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, hsl(var(--gold) / 0.2) 0%, transparent 50%)`
        }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.decimal ? (
                  <span>{stat.value}{stat.suffix}</span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-sm tracking-widest uppercase text-primary-foreground/60 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
