import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Linkedin, Github, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@johndeveloper.com",
    href: "mailto:hello@johndeveloper.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/johndeveloper",
    href: "https://linkedin.com/in/johndeveloper",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/johndeveloper",
    href: "https://github.com/johndeveloper",
  },
];

export function ContactSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="contact" className="section-padding bg-background-secondary" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-foreground-secondary max-w-2xl mx-auto text-lg">
            I'm always open to discussing new projects, creative ideas, or 
            opportunities to be part of your vision.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-secondary">Location</p>
                  <p className="font-medium">San Francisco, CA (Remote)</p>
                </div>
              </div>

              {/* Contact Links */}
              {contactLinks.map((contact, index) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <contact.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground-secondary">{contact.label}</p>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {contact.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 rounded-2xl bg-card border border-border text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">
                Ready to Start a Project?
              </h3>
              <p className="text-foreground-secondary mb-8">
                Whether you have a project in mind or just want to chat, 
                feel free to reach out. I'll get back to you as soon as possible.
              </p>
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-6 shadow-glow transition-all duration-300"
                asChild
              >
                <a href="mailto:hello@johndeveloper.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Me an Email
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
