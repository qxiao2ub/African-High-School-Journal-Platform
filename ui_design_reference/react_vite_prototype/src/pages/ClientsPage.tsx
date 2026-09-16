import { Link } from "react-router-dom";

const clients = ["Adobe", "Envato", "jQuery", "WordPress", "GitHub"];

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <span className="text-xl font-bold tracking-wide text-muted-foreground/40 select-none">
        {name}
      </span>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Clients</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">CLIENTS</span>
        </nav>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-5 border-b border-border">
        {clients.map((c) => (
          <LogoPlaceholder key={c} name={c} />
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 py-6">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-5 border-b border-border">
        {clients.map((c) => (
          <LogoPlaceholder key={`2-${c}`} name={c} />
        ))}
      </div>
    </div>
  );
}
