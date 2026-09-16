import { useParams, Link } from "react-router-dom";
import { getArticleById, articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import { Heart, Share2, Facebook, Twitter } from "lucide-react";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = getArticleById(id || "");

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-border">404</h1>
          <p className="text-xl font-serif mt-4 mb-6">Article not found.</p>
          <Link to="/" className="text-primary font-semibold hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const related = articles
    .filter((a) => a.id !== article.id && a.category.some((c) => article.category.includes(c)))
    .slice(0, 3);

  const sidebar = articles.filter((a) => a.id !== article.id).slice(0, 5);

  return (
    <div>
      {/* Hero image */}
      <div className="w-full max-h-[500px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-[500px] object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <span className="text-primary font-bold">{article.category[0]}</span>
          </nav>

          {/* Meta */}
          <div className="text-xs text-muted-foreground mb-3 flex items-center gap-3 flex-wrap">
            <span>{article.date}</span>
            {article.category.map((c) => (
              <span key={c} className="text-primary font-bold uppercase">{c}</span>
            ))}
            <span>BY {article.author.toUpperCase()}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-serif leading-tight mb-6">
            {article.title}
          </h1>

          {/* Share bar */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition">
              <Heart className="w-4 h-4" /> {article.likes || 0}
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#1877F2] transition">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#1DA1F2] transition">
              <Twitter className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="prose prose-lg max-w-none">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-foreground leading-relaxed mb-6 text-base">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
            {article.category.map((c) => (
              <span
                key={c}
                className="inline-block bg-secondary text-foreground px-3 py-1 rounded-full text-xs font-medium hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold font-serif mb-6 border-b-2 border-primary pb-2">
                RELATED ARTICLES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside>
          <h3 className="text-xl font-bold font-serif mb-4 border-b-2 border-primary pb-2">
            LATEST ARTICLES
          </h3>
          {sidebar.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}

          {/* Newsletter mini */}
          <div className="mt-8 bg-secondary rounded-lg p-6">
            <h4 className="font-serif font-bold mb-3">NEWSLETTER</h4>
            <p className="text-sm text-muted-foreground mb-4">Get the latest stories delivered to your inbox.</p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full border border-input rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
            />
            <button className="w-full bg-primary text-primary-foreground py-2 rounded text-sm font-bold uppercase hover:opacity-90 transition">
              Subscribe
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
