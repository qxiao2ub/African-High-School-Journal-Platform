import { Link } from "react-router-dom";

const dividers = [
  { label: "Solid", style: "solid" },
  { label: "Dotted", style: "dotted" },
  { label: "Dashed", style: "dashed" },
  { label: "Double", style: "double" },
  { label: "Groove", style: "groove" },
  { label: "Ridge", style: "ridge" },
];

export default function DividersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Dividers</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">DIVIDERS</span>
        </nav>
      </div>

      {dividers.map((d) => (
        <section key={d.label} className="mb-12">
          <h2 className="text-xl font-serif italic mb-6">{d.label}</h2>
          <div className="space-y-6">
            <hr
              className="border-0"
              style={{
                borderTopStyle: d.style as any,
                borderTopWidth: d.style === "double" ? "4px" : "1px",
                borderTopColor: "hsl(var(--border))",
                width: "30%",
              }}
            />
            <hr
              className="border-0"
              style={{
                borderTopStyle: d.style as any,
                borderTopWidth: d.style === "double" ? "4px" : "1px",
                borderTopColor: "hsl(var(--border))",
                width: "50%",
              }}
            />
            <hr
              className="border-0"
              style={{
                borderTopStyle: d.style as any,
                borderTopWidth: d.style === "double" ? "4px" : "1px",
                borderTopColor: "hsl(var(--border))",
                width: "100%",
              }}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
