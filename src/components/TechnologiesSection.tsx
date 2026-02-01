import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiLaravel,
  SiDocker,
  SiGit,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiNextdotjs,
  SiVuedotjs,
  SiAmazonwebservices,
  SiFigma,
} from "react-icons/si";
import { DiHtml5, DiCss3 } from "react-icons/di";

const technologies = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Next.js", icon: SiNextdotjs, color: "" },
  { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "PHP", icon: SiPhp, color: "#777BB4" },
  { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
  { name: "HTML5", icon: DiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: DiCss3, color: "#1572B6" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
];

export function TechnologiesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="technologies" className="section-padding bg-background-secondary" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Technologies & <span className="text-gradient">Tools</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            A collection of technologies I use to build modern, scalable applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="group flex flex-col items-center justify-center p-4 md:p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <tech.icon
                className="h-8 w-8 md:h-10 md:w-10 mb-3 transition-colors duration-300"
                style={{ 
                  color: tech.color || "hsl(var(--foreground))" 
                }}
              />
              <span className="text-xs md:text-sm font-medium text-foreground-secondary group-hover:text-foreground transition-colors">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
