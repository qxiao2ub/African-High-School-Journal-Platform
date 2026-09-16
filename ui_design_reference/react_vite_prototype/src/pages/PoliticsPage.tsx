import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function PoliticsPage() {
  const politicsArticles = articles.filter((a) =>
    a.category.some((c) => c.toLowerCase() === "politics")
  );
  const otherArticles = articles.filter(
    (a) => !a.category.some((c) => c.toLowerCase() === "politics")
  );

  const featured = politicsArticles[0];
  const centerArticles = politicsArticles.slice(1, 3);
  const featuredStories = otherArticles.slice(0, 8);
  const [fsPage, setFsPage] = useState(0);
  const fsPerPage = 4;
  const fsVisible = featuredStories.slice(fsPage * fsPerPage, (fsPage + 1) * fsPerPage);
  const fsMaxPage = Math.ceil(featuredStories.length / fsPerPage) - 1;

  return (
    <div>
      {/* Title bar */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-end justify-between">
          <h1 className="text-3xl font-black font-serif uppercase tracking-tight">Politics</h1>
          <nav className="text-[11px] text-muted-foreground tracking-wide uppercase">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground font-medium">Politics</span>
          </nav>
        </div>
      </div>

      {/* Main 3-column content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_1fr_280px] gap-8">
        {/* Left — featured article with image */}
        <div>
          {featured && (
            <Link to={`/article/${featured.id}`} className="block group">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full aspect-[4/5] object-cover mb-4"
                loading="lazy"
              />
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
                {featured.date} ·{" "}
                <span className="text-primary font-bold">{featured.category.join(", ").toUpperCase()}</span>{" "}
                · BY {featured.author.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                {featured.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {featured.excerpt}
              </p>
            </Link>
          )}
        </div>

        {/* Center — text-only stacked articles */}
        <div className="space-y-0 divide-y divide-border">
          {centerArticles.map((a) => (
            <div key={a.id} className="py-6 first:pt-0">
              <div className="text-[11px] tracking-wide mb-1.5">
                <span className="text-muted-foreground">IN </span>
                <span className="text-primary font-bold">{a.category.join(", ").toUpperCase()}</span>
              </div>
              <Link to={`/article/${a.id}`} className="group">
                <h3 className="text-lg font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                  {a.title}
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                {a.excerpt}
              </p>
              <Link
                to={`/article/${a.id}`}
                className="text-primary text-xs font-bold uppercase tracking-wider hover:underline"
              >
                READ MORE
              </Link>
            </div>
          ))}
        </div>

        {/* Right sidebar — Reputation */}
        <aside>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Reputation</h3>
          {[
            { name: "THOMAS WILLIAMS", pct: 83 },
            { name: "ALICE BOHN", pct: 66 },
          ].map((r) => (
            <div key={r.name} className="mb-5">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>{r.name}</span>
                <span>{r.pct}%</span>
              </div>
              <div className="w-full bg-border h-[3px]">
                <div className="bg-primary h-full transition-all duration-700" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Featured Stories */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="border-t border-border pt-8">
          <h2 className="text-2xl font-black font-serif uppercase tracking-tight mb-1">
            Featured Stories
          </h2>
          <div className="h-[3px] bg-primary w-full mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Left placeholder area for potential image/slider */}
            <div />

            {/* Right — text-only article list */}
            <div className="space-y-0 divide-y divide-border">
              {fsVisible.map((a) => (
                <div key={a.id} className="py-5 first:pt-0">
                  <div className="text-[11px] tracking-wide mb-1">
                    <span className="text-muted-foreground">IN </span>
                    <span className="text-primary font-bold">{a.category.join(", ").toUpperCase()}</span>
                  </div>
                  <Link to={`/article/${a.id}`} className="group">
                    <h4 className="text-base font-bold font-serif leading-snug mb-1.5 group-hover:text-primary transition">
                      {a.title}
                    </h4>
                  </Link>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {a.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination arrows */}
          <div className="flex justify-end gap-1 mt-6">
            <button
              onClick={() => setFsPage(Math.max(0, fsPage - 1))}
              disabled={fsPage === 0}
              className="w-7 h-7 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFsPage(Math.min(fsMaxPage, fsPage + 1))}
              disabled={fsPage >= fsMaxPage}
              className="w-7 h-7 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
