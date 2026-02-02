import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "pt";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.technologies": "Technologies",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    
    // Hero
    "hero.greeting": "Hello, I'm",
    "hero.title": "Full Stack Developer",
    "hero.description": "I build exceptional digital experiences that combine clean code with stunning design. Specialized in React, Node.js, and modern web technologies.",
    "hero.viewProjects": "View Projects",
    "hero.contactMe": "Contact Me",
    
    // About
    "about.title": "About",
    "about.titleHighlight": "Me",
    "about.bio1": "I'm a passionate Full Stack Developer with over 5 years of experience building web applications that make a difference. My journey started with curiosity about how websites work, and it evolved into a career focused on creating elegant solutions to complex problems.",
    "about.bio2": "I specialize in JavaScript ecosystems, particularly React and Node.js, but I'm always exploring new technologies. I believe in writing clean, efficient code and delivering products that users love.",
    "about.bio3": "When I'm not coding, you'll find me contributing to open-source projects, writing technical articles, or mentoring aspiring developers. I'm driven by the impact technology can have on people's lives.",
    "about.highlight1.title": "Clean Code",
    "about.highlight1.desc": "Writing maintainable, scalable, and well-documented code",
    "about.highlight2.title": "Performance",
    "about.highlight2.desc": "Optimizing for speed and exceptional user experience",
    "about.highlight3.title": "Collaboration",
    "about.highlight3.desc": "Working effectively with teams across the globe",
    "about.highlight4.title": "Innovation",
    "about.highlight4.desc": "Staying current with the latest technologies",
    
    // Projects
    "projects.featured": "Featured",
    "projects.title": "Projects",
    "projects.subtitle": "Explore my latest work. These projects are automatically synced from my GitHub profile.",
    "projects.all": "All",
    "projects.loading": "Loading projects...",
    "projects.error": "Failed to load projects. Please try again later.",
    "projects.errorHint": "Please check the GitHub username or try again later.",
    "projects.noDescription": "No description available",
    "projects.viewCode": "View Code",
    "projects.liveDemo": "Live Demo",
    "projects.viewAll": "View All on GitHub",
    
    // Technologies
    "tech.title": "Technologies",
    "tech.tools": "Tools",
    "tech.subtitle": "A collection of technologies I use to build modern, scalable applications.",
    
    // Experience
    "exp.title": "Experience",
    "exp.impact": "Impact",
    "exp.subtitle": "Numbers that represent my journey and the value I've delivered.",
    "exp.years": "Years of Experience",
    "exp.projects": "Completed Projects",
    "exp.technologies": "Technologies",
    "exp.clients": "Satisfied Clients",
    
    // Contact
    "contact.lets": "Let's",
    "contact.connect": "Connect",
    "contact.subtitle": "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
    "contact.location": "Location",
    "contact.locationValue": "San Francisco, CA (Remote)",
    "contact.emailLabel": "Email",
    "contact.ctaTitle": "Ready to Start a Project?",
    "contact.ctaDescription": "Whether you have a project in mind or just want to chat, feel free to reach out. I'll get back to you as soon as possible.",
    "contact.sendEmail": "Send Me an Email",
    
    // Footer
    "footer.madeWith": "Made with",
    "footer.by": "by John Developer",
  },
  pt: {
    // Navbar
    "nav.about": "Sobre",
    "nav.projects": "Projetos",
    "nav.technologies": "Tecnologias",
    "nav.experience": "Experiência",
    "nav.contact": "Contato",
    
    // Hero
    "hero.greeting": "Olá, eu sou",
    "hero.title": "Desenvolvedor Full Stack",
    "hero.description": "Construo experiências digitais excepcionais que combinam código limpo com design impressionante. Especializado em React, Node.js e tecnologias web modernas.",
    "hero.viewProjects": "Ver Projetos",
    "hero.contactMe": "Entre em Contato",
    
    // About
    "about.title": "Sobre",
    "about.titleHighlight": "Mim",
    "about.bio1": "Sou um Desenvolvedor Full Stack apaixonado com mais de 5 anos de experiência construindo aplicações web que fazem a diferença. Minha jornada começou com a curiosidade sobre como os sites funcionam, e evoluiu para uma carreira focada em criar soluções elegantes para problemas complexos.",
    "about.bio2": "Especializo-me em ecossistemas JavaScript, particularmente React e Node.js, mas estou sempre explorando novas tecnologias. Acredito em escrever código limpo e eficiente e entregar produtos que os usuários adoram.",
    "about.bio3": "Quando não estou programando, você me encontrará contribuindo para projetos open-source, escrevendo artigos técnicos ou mentorando desenvolvedores aspirantes. Sou motivado pelo impacto que a tecnologia pode ter na vida das pessoas.",
    "about.highlight1.title": "Código Limpo",
    "about.highlight1.desc": "Escrevendo código manutenível, escalável e bem documentado",
    "about.highlight2.title": "Performance",
    "about.highlight2.desc": "Otimizando para velocidade e experiência excepcional do usuário",
    "about.highlight3.title": "Colaboração",
    "about.highlight3.desc": "Trabalhando efetivamente com equipes ao redor do mundo",
    "about.highlight4.title": "Inovação",
    "about.highlight4.desc": "Mantendo-se atualizado com as últimas tecnologias",
    
    // Projects
    "projects.featured": "Projetos",
    "projects.title": "Destacados",
    "projects.subtitle": "Explore meus trabalhos mais recentes. Estes projetos são sincronizados automaticamente do meu perfil GitHub.",
    "projects.all": "Todos",
    "projects.loading": "Carregando projetos...",
    "projects.error": "Falha ao carregar projetos. Tente novamente mais tarde.",
    "projects.errorHint": "Por favor, verifique o nome de usuário do GitHub ou tente novamente mais tarde.",
    "projects.noDescription": "Sem descrição disponível",
    "projects.viewCode": "Ver Código",
    "projects.liveDemo": "Demo ao Vivo",
    "projects.viewAll": "Ver Todos no GitHub",
    
    // Technologies
    "tech.title": "Tecnologias",
    "tech.tools": "Ferramentas",
    "tech.subtitle": "Uma coleção de tecnologias que uso para construir aplicações modernas e escaláveis.",
    
    // Experience
    "exp.title": "Experiência",
    "exp.impact": "Impacto",
    "exp.subtitle": "Números que representam minha jornada e o valor que entreguei.",
    "exp.years": "Anos de Experiência",
    "exp.projects": "Projetos Concluídos",
    "exp.technologies": "Tecnologias",
    "exp.clients": "Clientes Satisfeitos",
    
    // Contact
    "contact.lets": "Vamos",
    "contact.connect": "Conectar",
    "contact.subtitle": "Estou sempre aberto para discutir novos projetos, ideias criativas ou oportunidades de fazer parte da sua visão.",
    "contact.location": "Localização",
    "contact.locationValue": "São Paulo, SP (Remoto)",
    "contact.emailLabel": "Email",
    "contact.ctaTitle": "Pronto para Iniciar um Projeto?",
    "contact.ctaDescription": "Se você tem um projeto em mente ou apenas quer conversar, fique à vontade para entrar em contato. Responderei o mais rápido possível.",
    "contact.sendEmail": "Envie-me um Email",
    
    // Footer
    "footer.madeWith": "Feito com",
    "footer.by": "por John Developer",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "pt" : "en"));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
