import { articles } from "@/data/articles";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const tags = [
  "Art & Design", "Blog", "Business", "Culture", "Economy", "Health",
  "Lifestyle", "Movies", "N.Y.", "Paper", "Obituaries", "Photos",
  "Politics", "Post", "Science", "Sports", "Tech", "Today's Arts",
  "Travel", "U.S.", "Videos", "World",
];

const tagSizes: Record<string, string> = {
  Blog: "text-lg", Lifestyle: "text-lg", Videos: "text-base",
  Sports: "text-base", Health: "text-base",
};

export default function HomeClassic() {
  const latestArticles = articles.slice(20, 30);
  const breakingArticles = [articles[10], articles[16], articles[5]];
  const dailyFeed = [articles[8], articles[9], articles[10], articles[11]];
  const recommended = articles.slice(12, 16);
  const [recIdx, setRecIdx] = useState(0);
  const recArticle = recommended[recIdx];

  const [dfPage, setDfPage] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_240px] gap-8">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="hidden lg:block">
          {/* Latest Articles */}
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Latest Articles</h3>
          <ul className="space-y-2.5 mb-8">
            {latestArticles.map((a) => (
              <li key={a.id} className="flex items-start gap-2">
                <span className="text-[6px] mt-1.5 leading-none">●</span>
                <Link to={`/article/${a.id}`} className="text-xs leading-snug hover:text-primary transition">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Recommended */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider">Recommended</h3>
              <div className="flex gap-1">
                <button onClick={() => setRecIdx(Math.max(0, recIdx - 1))} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-primary">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setRecIdx(Math.min(recommended.length - 1, recIdx + 1))} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-primary">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <Link to={`/article/${recArticle.id}`} className="block group">
              <img src={recArticle.image} alt={recArticle.title} className="w-full aspect-[4/3] object-cover mb-2" loading="lazy" />
              <h4 className="text-xs font-bold leading-snug group-hover:text-primary transition">{recArticle.title}</h4>
            </Link>
          </div>

          {/* Advertising placeholder */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3">Advertising</h3>
            <div className="w-full aspect-[240/400] bg-secondary border border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-xs font-bold uppercase">Vertical</p>
                <p className="text-xs font-bold uppercase">Rectangle</p>
                <p className="text-[10px]">(240×400)</p>
              </div>
            </div>
          </div>

          {/* Top Searches / Tag Cloud */}
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3">Top Searches</h3>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            {tags.map((t) => (
              <Link
                key={t}
                to="/"
                className={`${tagSizes[t] || "text-xs"} text-muted-foreground hover:text-primary transition`}
              >
                {t}
              </Link>
            ))}
          </div>
        </aside>

        {/* ===== CENTER — BREAKING NEWS ===== */}
        <div>
          <h2 className="text-3xl font-serif italic mb-6">Breaking News</h2>

          {breakingArticles.map((a, i) => (
            <div key={a.id} className={i < breakingArticles.length - 1 ? "mb-8 pb-8 border-b border-border" : "mb-8"}>
              {i === 0 && (
                <img src={a.image} alt={a.title} className="w-full aspect-[16/10] object-cover mb-4" loading="lazy" />
              )}
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
                {a.date} ·{" "}
                <span className="text-primary font-bold">{a.category.join(", ").toUpperCase()}</span>{" "}
                · BY {a.author.toUpperCase()}
              </div>
              <Link to={`/article/${a.id}`} className="group">
                <h3 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                  {a.title}
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{a.excerpt}</p>
              <Link to={`/article/${a.id}`} className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
                READ MORE
              </Link>
            </div>
          ))}

          {/* Featured Stories */}
          <div className="border-t border-border pt-8">
            <h2 className="text-3xl font-serif italic mb-6">Featured Stories</h2>
            <div className="h-[2px] bg-border mb-8" />
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR — DAILY FEED ===== */}
        <aside>
          <h2 className="text-2xl font-serif italic mb-5">Daily Feed</h2>
          <div className="divide-y divide-border">
            {dailyFeed.map((a) => (
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

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
            <Link to="/shortcodes/blog" className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
              VIEW MORE POSTS
            </Link>
            <div className="flex gap-1">
              <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Classic multi-column footer */}
      <div className="border-t border-border mt-8 pt-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[200px_1fr_1fr_1fr] gap-8">
          <div>
            <Link to="/home-classic" className="block mb-4">
              <span className="block text-[10px] font-serif italic tracking-[0.2em] text-muted-foreground">The</span>
              <span className="block text-xl font-black font-serif tracking-tight leading-[0.9] uppercase">Paper</span>
            </Link>
            <ul className="space-y-1.5">
              {["Reader Center", "Tools & Services", "Times Topics", "T.N. Events Guide", "Times Journeys", "Subscribe to the Journal", "Our Contacts"].map((l) => (
                <li key={l}><Link to="/" className="text-xs font-serif italic text-muted-foreground hover:text-primary transition">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3">News</h4>
            <ul className="space-y-1.5">
              {["Arts", "Economy", "Fashion & Style", "Food", "Health", "Lifestyle", "Politics", "Science", "Sports", "Technology", "Travel"].map((l) => (
                <li key={l}><Link to="/" className="text-xs font-serif italic text-muted-foreground hover:text-primary transition">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Opinion</h4>
            <ul className="space-y-1.5">
              {["Today's Opinion", "Op-Ed Columnists", "Editorials", "Contributing Writers", "Op-Ed Contributors", "Opinionator", "Letters", "Sunday Review", "Taking Note", "Room for Debate", "Public Editor"].map((l) => (
                <li key={l}><Link to="/" className="text-xs font-serif italic text-muted-foreground hover:text-primary transition">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Most Popular</h4>
            <ul className="space-y-1.5">
              {["Art & Design", "World", "Blog", "Business", "Culture", "Lifestyle", "N.Y.", "Paper", "Photos", "Post"].map((l) => (
                <li key={l}><Link to="/" className="text-xs font-serif italic text-muted-foreground hover:text-primary transition">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
