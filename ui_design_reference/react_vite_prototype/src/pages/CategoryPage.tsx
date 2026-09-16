import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CategoryPageProps {
  category: string;
  title: string;
}

export default function CategoryPage({ category, title }: CategoryPageProps) {
  const filtered = articles.filter((a) =>
    a.category.some((c) => c.toLowerCase() === category.toLowerCase())
  );
  const featured = filtered[0];
  const secondArticle = filtered[1];
  const leftSidebar = filtered.slice(2, 4);
  const rightFeed = articles
    .filter((a) => !a.category.some((c) => c.toLowerCase() === category.toLowerCase()))
    .slice(0, 5);

  const [leftIdx, setLeftIdx] = useState(0);
  const leftPage = leftSidebar.length > 0 ? [leftSidebar[leftIdx % leftSidebar.length]] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-8">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">{title}</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">{title.toUpperCase()}</span>
        </nav>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_260px] gap-8">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="hidden lg:block">
          <div className="divide-y divide-border">
            {leftSidebar.map((a) => (
              <div key={a.id} className="py-4 first:pt-0">
                <div className="text-[10px] tracking-wide mb-1">
                  <span className="text-muted-foreground">IN </span>
                  <span className="text-primary font-bold">{a.category[0].toUpperCase()}</span>
                </div>
                <Link to={`/article/${a.id}`} className="group">
                  <h4 className="text-sm font-bold font-serif leading-snug mb-1.5 group-hover:text-primary transition">
                    {a.title}
                  </h4>
                </Link>
                <p className="text-muted-foreground text-xs leading-relaxed">{a.excerpt}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-1 mt-4 pt-3 border-t border-border">
            <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* ===== CENTER COLUMN ===== */}
        <div>
          {/* Featured article with large image */}
          {featured && (
            <div className="mb-8 pb-8 border-b border-border">
              <Link to={`/article/${featured.id}`} className="group block">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full aspect-[16/10] object-cover mb-4"
                  loading="lazy"
                />
              </Link>
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
                {featured.date} ·{" "}
                <span className="text-primary font-bold">{featured.category.join(", ").toUpperCase()}</span>{" "}
                · BY <span className="text-primary font-bold">{featured.author.toUpperCase()}</span>
              </div>
              <Link to={`/article/${featured.id}`} className="group">
                <h2 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                  {featured.title}
                </h2>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">{featured.excerpt}</p>
            </div>
          )}

          {/* Second article */}
          {secondArticle && (
            <div className="mb-8">
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
                {secondArticle.date} ·{" "}
                <span className="text-primary font-bold">{secondArticle.category.join(", ").toUpperCase()}</span>{" "}
                · BY <span className="text-primary font-bold">{secondArticle.author.toUpperCase()}</span>
              </div>
              <Link to={`/article/${secondArticle.id}`} className="group">
                <h3 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                  {secondArticle.title}
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{secondArticle.excerpt}</p>
              <Link
                to={`/article/${secondArticle.id}`}
                className="text-xs font-bold uppercase tracking-wider hover:text-primary transition"
              >
                READ MORE
              </Link>
            </div>
          )}

          {/* Featured Stories */}
          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold font-serif uppercase tracking-tight mb-2">FEATURED STORIES</h2>
            <div className="h-[1px] bg-border mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.slice(2, 6).map((a) => (
                <div key={a.id} className="mb-4">
                  <Link to={`/article/${a.id}`} className="group block">
                    <img src={a.image} alt={a.title} className="w-full aspect-[4/3] object-cover mb-3" loading="lazy" />
                    <h4 className="font-serif font-bold text-sm leading-snug mb-1 group-hover:text-primary transition">
                      {a.title}
                    </h4>
                  </Link>
                  <p className="text-xs italic text-muted-foreground">by {a.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <aside>
          <div className="divide-y divide-border">
            {rightFeed.map((a) => (
              <div key={a.id} className="py-4 first:pt-0">
                <div className="text-[10px] tracking-wide mb-1">
                  <span className="text-muted-foreground">IN </span>
                  <span className="text-primary font-bold">{a.category.join(", ").toUpperCase()}</span>
                </div>
                <Link to={`/article/${a.id}`} className="group">
                  <h4 className="text-sm font-bold font-serif leading-snug mb-1.5 group-hover:text-primary transition">
                    {a.title}
                  </h4>
                </Link>
                <p className="text-muted-foreground text-xs leading-relaxed">{a.excerpt}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-1 mt-5 pt-4 border-t border-border">
            <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
