import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";

interface Props {
  article: Article;
  variant?: "default" | "compact" | "hero";
}

export default function ArticleCard({ article, variant = "default" }: Props) {
  const to = `/article/${article.id}`;

  if (variant === "compact") {
    return (
      <Link to={to} className="flex gap-4 py-4 border-b border-border last:border-0 group">
        <img src={article.image} alt={article.title} className="w-20 h-20 object-cover rounded flex-shrink-0" loading="lazy" />
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            {article.category[0]}
          </span>
          <h4 className="text-sm font-bold leading-tight mt-1 group-hover:text-primary transition">
            {article.title}
          </h4>
        </div>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link to={to} className="group cursor-pointer block">
        <span className="text-xs font-bold text-primary uppercase tracking-wide">
          {article.category[0]}
        </span>
        <h3 className="text-sm font-bold mt-1 leading-tight group-hover:text-primary transition">
          {article.title}
        </h3>
      </Link>
    );
  }

  return (
    <Link to={to} className="block">
      <article className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
        <img src={article.image} alt={article.title} className="w-full h-48 object-cover" loading="lazy" />
        <div className="p-6">
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            {article.category.join(", ")}
          </span>
          <h3 className="text-xl font-bold mt-2 mb-2 group-hover:text-primary transition font-serif">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{article.excerpt}</p>
          <div className="text-xs text-muted-foreground flex items-center gap-4">
            <span>{article.date}</span>
            <span>BY {article.author.toUpperCase()}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
