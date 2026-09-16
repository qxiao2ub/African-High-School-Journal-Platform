import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tags = ["Breakfast", "Dinner", "Snacks", "Desserts", "Backing", "City Kitchen"];

export default function FoodPage() {
  const filtered = articles.filter((a) =>
    a.category.some((c) => c.toLowerCase() === "food")
  );
  const hero = filtered[0];
  const rest = filtered.slice(1, 3);
  const dailyFeed = articles.filter(
    (a) => !a.category.some((c) => c.toLowerCase() === "food")
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Food</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">FOOD</span>
        </nav>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Left — stacked articles */}
        <div>
          {hero && (
            <div className="mb-8 pb-8 border-b border-border">
              <Link to={`/article/${hero.id}`} className="block group">
                <img src={hero.image} alt={hero.title} className="w-full aspect-[4/3] object-cover mb-4" loading="lazy" />
              </Link>
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
                {hero.date} · <span className="text-primary font-bold">FOOD</span> · BY{" "}
                <span className="text-primary font-bold">{hero.author.toUpperCase()}</span>
              </div>
              <Link to={`/article/${hero.id}`} className="group">
                <h2 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                  {hero.title}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">{hero.excerpt}</p>
            </div>
          )}

          {rest.map((a) => (
            <div key={a.id} className="mb-8 pb-8 border-b border-border last:border-0">
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
                {a.date} · <span className="text-primary font-bold">FOOD</span> · BY{" "}
                <span className="text-primary font-bold">{a.author.toUpperCase()}</span>
              </div>
              <Link to={`/article/${a.id}`} className="group">
                <h3 className="text-lg font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                  {a.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{a.excerpt}</p>
              <Link to={`/article/${a.id}`} className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
                READ MORE
              </Link>
            </div>
          ))}
        </div>

        {/* Right — newsletter + tags + daily feed */}
        <div>
          {/* Newsletter */}
          <div className="mb-8">
            <h3 className="text-lg font-serif font-bold text-center mb-4">Sign up for Newsletter:</h3>
            <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address *"
                className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition"
              >
                SIGN UP
              </button>
            </form>

            {/* Tag pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((t) => (
                <Link
                  key={t}
                  to="/food"
                  className="border border-border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Daily Feed */}
          <div>
            <h3 className="text-2xl font-bold font-serif uppercase tracking-tight mb-5">Daily Feed</h3>
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
            <div className="flex justify-end gap-1 mt-4 pt-3 border-t border-border">
              <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-6 h-6 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      <div className="border-t border-border pt-8">
        <h2 className="text-2xl font-bold font-serif uppercase tracking-tight mb-2">FEATURED STORIES</h2>
        <div className="h-[1px] bg-border" />
      </div>
    </div>
  );
}
