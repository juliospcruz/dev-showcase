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
    "about.title": "About Me",
    "about.subtitle": "Get to know me better",
    "about.bio1": "I'm a passionate Full Stack Developer with over 5 years of experience building web applications that make a difference. My journey in software development started with a curiosity about how things work on the internet, and it has evolved into a career focused on creating elegant, efficient, and user-friendly solutions.",
    "about.bio2": "I specialize in modern JavaScript/TypeScript ecosystems, with expertise in React, Node.js, and cloud technologies. I believe in writing clean, maintainable code and following best practices that ensure scalability and performance.",
    "about.bio3": "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community. I'm always eager to take on new challenges and collaborate on innovative projects.",
    
    // Projects
    "projects.title": "Projects",
    "projects.subtitle": "Check out my recent work",
    "projects.all": "All",
    "projects.loading": "Loading projects...",
    "projects.error": "Failed to load projects. Please try again later.",
    "projects.noDescription": "No description available",
    "projects.viewCode": "View Code",
    "projects.liveDemo": "Live Demo",
    
    // Technologies
    "tech.title": "Technologies",
    "tech.subtitle": "Tools and technologies I work with",
    
    // Experience
    "exp.title": "Experience",
    "exp.subtitle": "My professional journey in numbers",
    "exp.years": "Years Experience",
    "exp.projects": "Projects Completed",
    "exp.technologies": "Technologies",
    "exp.clients": "Happy Clients",
    
    // Contact
    "contact.title": "Get In Touch",
    "contact.subtitle": "Let's work together on your next project",
    "contact.description": "I'm currently available for freelance work and full-time positions. If you have a project that needs coding or an opportunity that matches my skills, don't hesitate to reach out!",
    "contact.email": "Email Me",
    "contact.linkedin": "Connect on LinkedIn",
    "contact.github": "Follow on GitHub",
    
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
    "about.title": "Sobre Mim",
    "about.subtitle": "Conheça-me melhor",
    "about.bio1": "Sou um Desenvolvedor Full Stack apaixonado com mais de 5 anos de experiência construindo aplicações web que fazem a diferença. Minha jornada no desenvolvimento de software começou com a curiosidade sobre como as coisas funcionam na internet, e evoluiu para uma carreira focada em criar soluções elegantes, eficientes e amigáveis.",
    "about.bio2": "Especializo-me em ecossistemas modernos JavaScript/TypeScript, com expertise em React, Node.js e tecnologias cloud. Acredito em escrever código limpo e manutenível, seguindo as melhores práticas que garantem escalabilidade e performance.",
    "about.bio3": "Quando não estou programando, você me encontrará explorando novas tecnologias, contribuindo para projetos open-source ou compartilhando conhecimento com a comunidade de desenvolvedores. Estou sempre ansioso para enfrentar novos desafios e colaborar em projetos inovadores.",
    
    // Projects
    "projects.title": "Projetos",
    "projects.subtitle": "Confira meus trabalhos recentes",
    "projects.all": "Todos",
    "projects.loading": "Carregando projetos...",
    "projects.error": "Falha ao carregar projetos. Tente novamente mais tarde.",
    "projects.noDescription": "Sem descrição disponível",
    "projects.viewCode": "Ver Código",
    "projects.liveDemo": "Demo ao Vivo",
    
    // Technologies
    "tech.title": "Tecnologias",
    "tech.subtitle": "Ferramentas e tecnologias com as quais trabalho",
    
    // Experience
    "exp.title": "Experiência",
    "exp.subtitle": "Minha jornada profissional em números",
    "exp.years": "Anos de Experiência",
    "exp.projects": "Projetos Concluídos",
    "exp.technologies": "Tecnologias",
    "exp.clients": "Clientes Satisfeitos",
    
    // Contact
    "contact.title": "Entre em Contato",
    "contact.subtitle": "Vamos trabalhar juntos no seu próximo projeto",
    "contact.description": "Atualmente estou disponível para trabalhos freelance e posições em tempo integral. Se você tem um projeto que precisa de desenvolvimento ou uma oportunidade que combina com minhas habilidades, não hesite em entrar em contato!",
    "contact.email": "Enviar Email",
    "contact.linkedin": "Conectar no LinkedIn",
    "contact.github": "Seguir no GitHub",
    
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
