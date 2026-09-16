import { Link } from "react-router-dom";
import { Code, Plus } from "lucide-react";

const blocks = [
  { icon: "</>", label: "Custom HTML" },
  { icon: "CSS", label: "Custom CSS" },
  { icon: "JS", label: "Custom JS" },
];

export default function CustomCodePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Custom HTML, CSS, JS</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">CUSTOM HTML, CSS, JS</span>
        </nav>
      </div>

      {/* Description */}
      <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto mb-12">
        Custom HTML, CSS and JS are powerful instruments for experienced developers, who'd like to add their own code, styles or scripts directly to the certain page.
      </p>

      {/* Code block mockups */}
      <div className="max-w-xl mx-auto space-y-8 mb-12">
        {blocks.map((block) => (
          <div key={block.label} className="border border-border">
            {/* Header */}
            <div className="bg-muted-foreground/70 text-background text-xs font-medium px-3 py-1.5">
              Section
            </div>
            <div className="bg-muted-foreground/20 text-xs text-muted-foreground px-3 py-1">
              1/1
            </div>
            {/* Content area */}
            <div className="border-t border-dashed border-border py-10 flex items-center justify-center gap-2 text-muted-foreground">
              <span className="text-sm font-mono font-bold">{block.icon}</span>
              <span className="text-sm">{block.label}</span>
            </div>
            {/* Plus button */}
            <div className="border-t border-dashed border-border py-2 flex items-center justify-center text-muted-foreground">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
