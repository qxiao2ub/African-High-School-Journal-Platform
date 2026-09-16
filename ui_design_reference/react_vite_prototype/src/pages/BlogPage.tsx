import { articles } from "@/data/articles";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const tags = ["Art & Design", "Blog", "Business", "Culture", "Economy", "Health", "Lifestyle", "Movies", "Paper", "Photos", "Politics", "Science", "Sports", "Tech", "Travel"];

const PER_PAGE = 4;

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / PER_PAGE);
  const pageArticles = articles.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Category counts
  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    articles.forEach((a) => a.category.forEach((c) => { map[c] = (map[c] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Blog</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">BLOG</span>
        </nav>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Left — articles */}
        <div>
          {pageArticles.map((a) => (
            <div key={a.id} className="mb-8 pb-8 border-b border-border last:border-0">
              <Link to={`/article/${a.id}`} className="block group">
                <img src={a.image} alt={a.title} className="w-full aspect-[16/10] object-cover mb-4" loading="lazy" />
              </Link>
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
                {a.date} ·{" "}
                <span className="text-primary font-bold">{a.category.join(", ").toUpperCase()}</span>{" "}
                · BY <span className="text-primary font-bold">{a.author.toUpperCase()}</span>
              </div>
              <Link to={`/article/${a.id}`} className="group">
                <h2 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                  {a.title}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{a.excerpt}</p>
              <Link to={`/article/${a.id}`} className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
                READ MORE
              </Link>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center gap-1 mt-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center border rounded-sm text-xs font-bold transition ${
                  p === page
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {p}
              </button>
            ))}
            {totalPages > 5 && <span className="px-1 text-muted-foreground">...</span>}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <aside>
          {/* Search */}
          <form className="flex mb-8" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 border border-border border-r-0 bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-3 py-2 hover:opacity-90 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Categories */}
          <h3 className="text-lg font-bold font-serif mb-4">Categories</h3>
          <ul className="space-y-2 mb-8 border-b border-border pb-8">
            {categories.map(([cat, count]) => (
              <li key={cat} className="flex items-start gap-2">
                <span className="text-[6px] mt-1.5 leading-none">●</span>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition">
                  {cat} ({count})
                </Link>
              </li>
            ))}
          </ul>

          {/* Tags */}
          <h3 className="text-lg font-bold font-serif mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link
                key={t}
                to="/shortcodes/blog"
                className="border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition"
              >
                {t}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
