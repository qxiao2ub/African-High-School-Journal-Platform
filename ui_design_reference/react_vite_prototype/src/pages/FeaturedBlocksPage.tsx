import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

export default function FeaturedBlocksPage() {
  const hero = articles[9];
  const blocks = [
    { text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate." },
    { text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate." },
    { text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Featured Blocks</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">FEATURED BLOCKS</span>
        </nav>
      </div>

      {/* Hero block — text left, image right */}
      <div className="grid grid-cols-1 md:grid-cols-2 mb-12">
        <div className="bg-secondary p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold font-serif leading-snug mb-4">{hero.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{hero.excerpt} {hero.excerpt}</p>
        </div>
        <div>
          <img
            src={hero.image}
            alt={hero.title}
            className="w-full h-full object-cover min-h-[300px]"
            loading="lazy"
          />
        </div>
      </div>

      <div className="border-t border-border mb-10" />

      {/* Three feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {blocks.map((b, i) => (
          <div key={i}>
            <div className="w-full h-10 bg-secondary mb-6" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{b.text}</p>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">
              LEARN MORE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
