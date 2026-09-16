import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

export default function OpinionPage() {
  // Two sets of articles for the two sections
  const sectionOne = articles.slice(0, 9);
  const sectionTwo = articles.slice(9, 18);

  const ArticleEntry = ({ a }: { a: (typeof articles)[0] }) => (
    <div>
      <div className="text-[11px] tracking-wide mb-1">
        <span className="text-muted-foreground">IN </span>
        <span className="text-primary font-bold">{a.category.join(", ").toUpperCase()}</span>
      </div>
      <Link to={`/article/${a.id}`} className="group">
        <h3 className="text-[15px] font-bold font-serif leading-snug mb-2 group-hover:text-primary transition">
          {a.title}
        </h3>
      </Link>
      <p className="text-muted-foreground text-xs leading-relaxed">{a.excerpt}</p>
    </div>
  );

  return (
    <div>
      {/* Title bar */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-black font-serif uppercase tracking-tight">
            The Opinion Pages
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section 1 — 3×3 grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 py-10">
          {sectionOne.map((a) => (
            <ArticleEntry key={a.id} a={a} />
          ))}
        </div>

        {/* Section 2 — 3-column with bottom rules */}
        <div className="border-t border-border pt-10 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-0">
            {[0, 1, 2].map((col) => {
              const colArticles = sectionTwo.filter((_, i) => i % 3 === col);
              return (
                <div key={col} className="space-y-8">
                  {colArticles.map((a) => (
                    <ArticleEntry key={a.id} a={a} />
                  ))}
                  <div className="h-[3px] bg-primary w-2/5 mt-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
