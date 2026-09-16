import { Link } from "react-router-dom";

export default function EmbeddedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Embedded</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">EMBEDDED</span>
        </nav>
      </div>

      {/* Youtube */}
      <section className="mb-10 pb-10 border-b border-border">
        <h2 className="text-xl font-serif italic text-center mb-6">Youtube</h2>
        <div className="aspect-video w-full bg-secondary flex items-center justify-center">
          <p className="text-muted-foreground text-sm">YouTube embed placeholder</p>
        </div>
      </section>

      {/* Vimeo */}
      <section className="mb-10 pb-10 border-b border-border">
        <h2 className="text-xl font-serif italic text-center mb-6">Vimeo</h2>
        <div className="aspect-video w-full bg-secondary flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Vimeo embed placeholder</p>
        </div>
      </section>

      {/* Soundcloud */}
      <section className="mb-10">
        <h2 className="text-xl font-serif italic text-center mb-6">Soundcloud</h2>
        <div className="w-full h-40 bg-secondary flex items-center justify-center">
          <p className="text-muted-foreground text-sm">SoundCloud embed placeholder</p>
        </div>
      </section>
    </div>
  );
}
