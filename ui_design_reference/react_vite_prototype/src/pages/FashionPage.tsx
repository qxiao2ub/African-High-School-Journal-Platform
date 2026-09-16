import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

export default function FashionPage() {
  const filtered = articles.filter((a) =>
    a.category.some((c) => c.toLowerCase() === "fashion & style")
  );
  const hero = filtered[0];
  const galleryImages = filtered.slice(1, 4);
  const grid = filtered.slice(1, 7);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Fashion &amp; Style</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">FASHION &amp; STYLE</span>
        </nav>
      </div>

      {/* Hero — text left, image right */}
      {hero && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <p className="text-[11px] text-muted-foreground tracking-wide mb-3">{hero.date}</p>
            <Link to={`/article/${hero.id}`} className="group">
              <h2 className="text-2xl font-bold font-serif leading-snug mb-4 group-hover:text-primary transition">
                {hero.title}
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{hero.excerpt}</p>
            <Link
              to={`/article/${hero.id}`}
              className="text-xs font-bold uppercase tracking-wider hover:text-primary transition"
            >
              READ MORE
            </Link>
          </div>
          <Link to={`/article/${hero.id}`} className="block">
            <img
              src={hero.image}
              alt={hero.title}
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
          </Link>
        </div>
      )}

      {/* Image gallery strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {galleryImages.map((a) => (
          <Link to={`/article/${a.id}`} key={a.id} className="block overflow-hidden">
            <img
              src={a.image}
              alt={a.title}
              className="w-full aspect-[3/2] object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
        ))}
      </div>

      {/* 3-column article grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {grid.map((a) => (
          <div key={a.id}>
            <Link to={`/article/${a.id}`} className="group block">
              <img
                src={a.image}
                alt={a.title}
                className="w-full aspect-[4/3] object-cover mb-3"
                loading="lazy"
              />
            </Link>
            <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">
              {a.date} · <span className="text-primary font-bold">FASHION &amp; STYLE</span>
            </div>
            <Link to={`/article/${a.id}`} className="group">
              <h3 className="font-serif font-bold text-base leading-snug mb-2 group-hover:text-primary transition">
                {a.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">{a.excerpt}</p>
          </div>
        ))}
      </div>

      <div className="h-[1px] bg-border" />
    </div>
  );
}
