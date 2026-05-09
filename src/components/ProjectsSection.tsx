import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Star, GitBranch, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  updated_at: string;
}

interface EnrichedRepo extends Repository {
  prettyName: string;
  languages: string[];
  randomStars: number;
  randomBranches: number;
  images: string[];
}

const GITHUB_USERNAME = "juliospcruz";

// Deterministic pseudo-random based on a seed
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function prettifyName(name: string): string {
  return name
    .replace(/[-_.]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function ProjectsSection() {
  const [repos, setRepos] = useState<EnrichedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ALL_FILTER = "__all__";
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);
  const { t } = useLanguage();

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

        if (!response.ok) throw new Error("Failed to fetch repositories");

        const data: Repository[] = await response.json();
        const filtered = data
          .filter((r) => !r.fork && r.description)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 9);

        // Enrich each repo with extra languages, random metrics and images
        const enriched: EnrichedRepo[] = await Promise.all(
          filtered.map(async (repo) => {
            let languages: string[] = repo.language ? [repo.language] : [];
            try {
              const lr = await fetch(repo.languages_url);
              if (lr.ok) {
                const langs = await lr.json();
                languages = Object.keys(langs);
              }
            } catch {
              // ignore, fallback to single language
            }

            const stars = Math.floor(seededRandom(repo.id) * 480) + 20;
            const branches = Math.floor(seededRandom(repo.id + 1) * 18) + 2;

            // Real images: GitHub OG card + images parsed from the repo README
            const ogImage = `https://opengraph.githubassets.com/1/${repo.full_name}`;
            const images: string[] = [ogImage];

            try {
              const readmeRes = await fetch(
                `https://api.github.com/repos/${repo.full_name}/readme`,
                { headers: { Accept: "application/vnd.github.raw" } }
              );
              if (readmeRes.ok) {
                const md = await readmeRes.text();
                const found = new Set<string>();

                const resolveUrl = (url: string): string | null => {
                  const trimmed = url.trim().replace(/^["'<]|["'>]$/g, "");
                  if (!trimmed) return null;
                  if (/^https?:\/\//i.test(trimmed)) return trimmed;
                  if (trimmed.startsWith("//")) return `https:${trimmed}`;
                  const clean = trimmed.replace(/^\.?\/+/, "");
                  return `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch || "main"}/${clean}`;
                };

                const isImage = (url: string) =>
                  /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);

                // Markdown ![](url)
                const mdRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
                let m: RegExpExecArray | null;
                while ((m = mdRe.exec(md)) !== null) {
                  const u = resolveUrl(m[1]);
                  if (u && isImage(u)) found.add(u);
                }

                // HTML <img src="...">
                const htmlRe = /<img[^>]+src=["']([^"']+)["']/gi;
                while ((m = htmlRe.exec(md)) !== null) {
                  const u = resolveUrl(m[1]);
                  if (u && isImage(u)) found.add(u);
                }

                for (const u of found) {
                  if (images.length >= 5) break;
                  if (!images.includes(u)) images.push(u);
                }
              }
            } catch {
              // ignore — keep OG image as the only entry
            }

            return {
              ...repo,
              prettyName: prettifyName(repo.name),
              languages,
              randomStars: stars,
              randomBranches: branches,
              images,
            };
          })
        );

        setRepos(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const languages = useMemo(() => {
    const langSet = new Set<string>();
    repos.forEach((repo) => repo.languages.forEach((l) => langSet.add(l)));
    return [ALL_FILTER, ...Array.from(langSet).sort()];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    if (activeFilter === ALL_FILTER) return repos;
    return repos.filter((repo) => repo.languages.includes(activeFilter));
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
            {t("projects.featured")} <span className="text-gradient">{t("projects.title")}</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-foreground-secondary max-w-2xl mx-auto">{t("projects.subtitle")}</p>
        </motion.div>

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

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-foreground-secondary">{t("projects.loading")}</span>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{t("projects.error")}</p>
            <p className="text-foreground-secondary">{t("projects.errorHint")}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRepos.map((repo, index) => (
              <ProjectCard
                key={repo.id}
                repo={repo}
                index={index}
                getLanguageColor={getLanguageColor}
                t={t}
              />
            ))}
          </motion.div>
        </AnimatePresence>

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
                {t("projects.viewAll")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  repo: EnrichedRepo;
  index: number;
  getLanguageColor: (l: string) => string;
  t: (k: string) => string;
}

function ProjectCard({ repo, index, getLanguageColor, t }: ProjectCardProps) {
  const [current, setCurrent] = useState(0);
  const total = repo.images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full"
    >
      {/* Carousel */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={repo.images[current]}
            alt={`${repo.prettyName} - ${current + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>

        <button
          onClick={prev}
          aria-label={t("projects.prevImage")}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur hover:bg-background transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          aria-label={t("projects.nextImage")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur hover:bg-background transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {repo.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`${t("projects.goToImage")} ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-5 bg-primary" : "w-1.5 bg-background/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
          {repo.prettyName}
        </h3>

        {repo.languages.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
            {repo.languages.slice(0, 4).map((lang) => (
              <span
                key={lang}
                className="flex items-center gap-1.5 text-xs text-foreground-secondary bg-muted px-2 py-1 rounded-full"
              >
                <span className={`w-2 h-2 rounded-full ${getLanguageColor(lang)}`} />
                {lang}
              </span>
            ))}
          </div>
        )}

        <p className="text-foreground-secondary text-sm line-clamp-3 flex-1 mb-4">
          {repo.description || t("projects.noDescription")}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {repo.randomStars}
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              {repo.randomBranches}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label={`${t("projects.viewCode")} ${repo.prettyName}`}
            >
              <Github className="h-4 w-4" />
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label={`${t("projects.liveDemo")} ${repo.prettyName}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
