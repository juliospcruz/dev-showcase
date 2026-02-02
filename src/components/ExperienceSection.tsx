import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, Briefcase, Code, Users } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface Stat {
  icon: typeof Calendar;
  value: number;
  suffix: string;
  labelKey: string;
}

const stats: Stat[] = [
  { icon: Calendar, value: 5, suffix: "+", labelKey: "exp.years" },
  { icon: Briefcase, value: 50, suffix: "+", labelKey: "exp.projects" },
  { icon: Code, value: 15, suffix: "+", labelKey: "exp.technologies" },
  { icon: Users, value: 30, suffix: "+", labelKey: "exp.clients" },
];

function AnimatedCounter({ 
  value, 
  suffix, 
  isInView 
}: { 
  value: number; 
  suffix: string; 
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      const stepDuration = duration / steps;

      const timer = setInterval(() => {
        countRef.current += increment;
        if (countRef.current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(countRef.current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gradient">
      {count}{suffix}
    </span>
  );
}

export function ExperienceSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { t } = useLanguage();

  return (
    <section id="experience" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("exp.title")} & <span className="text-gradient">{t("exp.impact")}</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            {t("exp.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative p-6 md:p-8 rounded-2xl bg-card border border-border text-center group hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className="relative mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              
              {/* Counter */}
              <div className="relative mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={inView} />
              </div>
              
              {/* Label */}
              <p className="relative text-sm md:text-base text-foreground-secondary font-medium">
                {t(stat.labelKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
