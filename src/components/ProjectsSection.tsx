import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Star, GitFork, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  updated_at: string;
}

// Replace with your GitHub username
const GITHUB_USERNAME = "octocat";

export function ProjectsSection() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data: Repository[] = await response.json();
        
        // Filter out forks and repos without description, sort by stars
        const filteredRepos = data
          .filter((repo) => !repo.fork && repo.description)
          .sort((a, b) => b.stargazers_count - a.stargazers_count);

        setRepos(filteredRepos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  // Get unique languages for filter buttons
  const languages = useMemo(() => {
    const langSet = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) langSet.add(repo.language);
    });
    return ["All", ...Array.from(langSet).sort()];
  }, [repos]);

  // Filter repos by selected language
  const filteredRepos = useMemo(() => {
    if (activeFilter === "All") return repos;
    return repos.filter((repo) => repo.language === activeFilter);
  }, [repos, activeFilter]);

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      PHP: "bg-indigo-500",
      Java: "bg-red-500",
      "C#": "bg-purple-500",
      Ruby: "bg-red-600",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      HTML: "bg-orange-600",
      CSS: "bg-blue-400",
      Shell: "bg-green-600",
    };
    return colors[language] || "bg-gray-500";
  };

  return (
    <section id="projects" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Explore my latest work. These projects are automatically synced from 
            my GitHub profile.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={activeFilter === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(lang)}
                className={`transition-all duration-300 ${
                  activeFilter === lang
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "hover:border-primary hover:text-primary"
                }`}
              >
                {lang}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-foreground-secondary">Loading projects...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <p className="text-foreground-secondary">
              Please check the GitHub username or try again later.
            </p>
          </div>
        )}

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRepos.slice(0, 9).map((repo, index) => (
              <motion.article
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {repo.name}
                    </h3>
                    {repo.language && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                        <span className="text-sm text-foreground-secondary">
                          {repo.language}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground-secondary text-sm line-clamp-3 flex-1 mb-4">
                  {repo.description}
                </p>

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {repo.forks_count}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      aria-label={`View ${repo.name} on GitHub`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        aria-label={`View ${repo.name} live demo`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Link */}
        {!loading && !error && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              asChild
            >
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View All on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
