import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, Rocket, Users, Zap } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function AboutSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useLanguage();

  const highlights = [
    {
      icon: Code2,
      title: t("about.highlight1.title"),
      description: t("about.highlight1.desc"),
    },
    {
      icon: Rocket,
      title: t("about.highlight2.title"),
      description: t("about.highlight2.desc"),
    },
    {
      icon: Users,
      title: t("about.highlight3.title"),
      description: t("about.highlight3.desc"),
    },
    {
      icon: Zap,
      title: t("about.highlight4.title"),
      description: t("about.highlight4.desc"),
    },
  ];

  return (
    <section id="about" className="section-padding bg-background-secondary" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("about.title")} <span className="text-gradient">{t("about.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground-secondary leading-relaxed">
              {t("about.bio1")}
            </p>
            <p className="text-lg text-foreground-secondary leading-relaxed">
              {t("about.bio2")}
            </p>
            <p className="text-lg text-foreground-secondary leading-relaxed">
              {t("about.bio3")}
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-foreground-secondary text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
