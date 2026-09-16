import { articles } from "@/data/articles";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomeVintage() {
  const hero = articles[26];
  const secondaryArticle = articles[25];
  const dailyFeed = [articles[7], articles[9], articles[11]];
  const featured = [
    { article: articles[16], layout: "left" as const },
    { article: articles[10], layout: "center" as const },
    { article: articles[27], layout: "right" as const },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Volume line */}
      <p className="text-right text-[11px] font-bold tracking-widest text-muted-foreground mb-6">
        VOLUME 67, NO.7 | SEPTEMBER 2017
      </p>

      {/* Hero + Daily Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mb-4">
        {/* Hero with overlay */}
        <Link to={`/article/${hero.id}`} className="relative block group overflow-hidden">
          <img
            src={hero.image}
            alt={hero.title}
            className="w-full aspect-[16/10] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 pr-12">
            <p className="text-[11px] tracking-wide text-white/70 mb-2">
              {hero.date} | <span className="font-bold">{hero.category[0].toUpperCase()}</span>
            </p>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight text-white group-hover:text-primary transition">
              {hero.title}
            </h2>
          </div>
        </Link>

        {/* Daily Feed sidebar */}
        <aside>
          <h3 className="text-2xl font-serif italic mb-5">Daily Feed</h3>
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

      {/* Secondary article row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mb-12">
        <Link to={`/article/${secondaryArticle.id}`} className="group grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
          <div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{secondaryArticle.excerpt}</p>
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-primary transition">
              READ MORE...
            </span>
          </div>
          <img
            src={secondaryArticle.image}
            alt={secondaryArticle.title}
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        </Link>
        <div />
      </div>

      {/* Featured News */}
      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-3xl font-serif italic mb-2">Featured News</h2>
        <div className="h-[1px] bg-border mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left article */}
          <div>
            <Link to={`/article/${featured[0].article.id}`} className="group block">
              <img
                src={featured[0].article.image}
                alt={featured[0].article.title}
                className="w-full aspect-[4/3] object-cover mb-4"
                loading="lazy"
              />
              <h3 className="font-serif font-bold text-lg leading-snug mb-1 group-hover:text-primary transition">
                {featured[0].article.title}
              </h3>
            </Link>
            <p className="text-xs italic text-muted-foreground mb-2">by {featured[0].article.author}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{featured[0].article.excerpt}</p>
            <Link to={`/article/${featured[0].article.id}`} className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
              READ MORE...
            </Link>
          </div>

          {/* Center — text-heavy article */}
          <div>
            <Link to={`/article/${featured[1].article.id}`} className="group block mb-4">
              <img
                src={featured[1].article.image}
                alt={featured[1].article.title}
                className="w-full aspect-[4/3] object-cover mb-4"
                loading="lazy"
              />
              <h3 className="font-serif font-bold text-lg leading-snug mb-1 group-hover:text-primary transition">
                {featured[1].article.title}
              </h3>
            </Link>
            <p className="text-xs italic text-muted-foreground mb-2">by {featured[1].article.author}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{featured[1].article.excerpt}</p>
            <Link to={`/article/${featured[1].article.id}`} className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
              READ MORE...
            </Link>
          </div>

          {/* Right article */}
          <div>
            <Link to={`/article/${featured[2].article.id}`} className="group block">
              <img
                src={featured[2].article.image}
                alt={featured[2].article.title}
                className="w-full aspect-[4/3] object-cover mb-4"
                loading="lazy"
              />
              <h3 className="font-serif font-bold text-lg leading-snug mb-1 group-hover:text-primary transition">
                {featured[2].article.title}
              </h3>
            </Link>
            <p className="text-xs italic text-muted-foreground mb-2">by {featured[2].article.author}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{featured[2].article.excerpt}</p>
            <Link to={`/article/${featured[2].article.id}`} className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
              READ MORE...
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-4">
          <Link to="/shortcodes/blog" className="text-xs font-bold uppercase tracking-wider hover:text-primary transition">
            VIEW MORE POSTS
          </Link>
        </div>
      </section>
    </div>
  );
}
