import { articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import { Link } from "react-router-dom";

export default function HomeModern() {
  const heroArticles = articles.slice(0, 4);
  const breakingArticle = articles[4];
  const breakingSecondary = articles[5];
  const dailyFeed = [articles[6], articles[7], articles[8], articles[9]];
  const featuredStories = articles.slice(10, 16);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero ticker — 4 text-only cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 py-6 border-b border-border">
        {heroArticles.map((a) => (
          <ArticleCard key={a.id} article={a} variant="hero" />
        ))}
      </div>

      {/* Breaking news + Daily feed — 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 py-8">
        {/* Breaking News */}
        <div>
          <h2 className="text-2xl font-bold font-serif mb-5 pb-2 border-b-2 border-primary">
            BREAKING NEWS
          </h2>

          {/* Featured article with image */}
          <Link to={`/article/${breakingArticle.id}`} className="block mb-6 group">
            <img
              src={breakingArticle.image}
              alt={breakingArticle.title}
              className="w-full aspect-[16/10] object-cover mb-4"
            />
            <div className="text-[11px] text-muted-foreground mb-1.5 tracking-wide">
              {breakingArticle.date} ·{" "}
              <span className="text-primary font-bold">{breakingArticle.category[0].toUpperCase()}</span> ·{" "}
              BY {breakingArticle.author.toUpperCase()}
            </div>
            <h3 className="text-xl font-bold font-serif leading-tight mb-2 group-hover:text-primary transition">
              {breakingArticle.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {breakingArticle.excerpt}
            </p>
          </Link>

          {/* Secondary article — text only */}
          <div className="border-t border-border pt-5">
            <Link to={`/article/${breakingSecondary.id}`} className="block group">
              <div className="text-[11px] text-muted-foreground mb-1.5 tracking-wide">
                {breakingSecondary.date} ·{" "}
                <span className="text-primary font-bold">
                  {breakingSecondary.category.join(", ").toUpperCase()}
                </span>{" "}
                · BY {breakingSecondary.author.toUpperCase()}
              </div>
              <h3 className="text-lg font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
                {breakingSecondary.title}
              </h3>
              <p className="text-muted-foreground text-sm">{breakingSecondary.excerpt}</p>
            </Link>
          </div>
        </div>

        {/* Daily Feed sidebar — text-only stacked list */}
        <aside>
          <h2 className="text-2xl font-bold font-serif mb-5 pb-2 border-b-2 border-primary">
            DAILY FEED
          </h2>
          <div className="divide-y divide-border">
            {dailyFeed.map((a) => (
              <Link
                key={a.id}
                to={`/article/${a.id}`}
                className="block py-4 first:pt-0 group"
              >
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {a.category.join(", ")}
                </span>
                <h4 className="text-sm font-bold leading-snug mt-1 group-hover:text-primary transition">
                  {a.title}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed mt-1 line-clamp-2">
                  {a.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      {/* Featured stories */}
      <section className="py-8 border-t border-border">
        <h2 className="text-2xl font-bold font-serif mb-6 pb-2 border-b-2 border-primary">
          FEATURED STORIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStories.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      <div className="text-center py-6 mb-2">
        <Link
          to="/shortcodes/blog"
          className="text-primary font-bold text-xs uppercase tracking-wider hover:underline"
        >
          VIEW MORE POSTS
        </Link>
      </div>
    </div>
  );
}
