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
    <section className="py-10 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center py-4 border-b border-border lg:border-b-0 lg:border-r last:border-r-0 last:border-b-0"
            >
              <div className="font-serif text-3xl md:text-4xl font-bold mb-1">
                <span className="text-gradient-gold">
                  {stat.decimal ? (
                    <>{stat.value}{stat.suffix}</>
                  ) : (
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  )}
                </span>
              </div>
              <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
