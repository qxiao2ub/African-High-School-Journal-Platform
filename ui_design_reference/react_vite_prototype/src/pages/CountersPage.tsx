import { Link } from "react-router-dom";
import { Waves, MessageSquare, User, Trophy, Heart, Lightbulb, Rocket, Gem } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const horizontal = [
  { label: "BLOGS", pct: 75 },
  { label: "LIFEHACK", pct: 80 },
  { label: "LIFESTYLE", pct: 95 },
];

const roundSkills = [
  { label: "FASHION", pct: 72 },
  { label: "HEALTH & BEAUTY", pct: 65 },
  { label: "MUSIC & ART", pct: 80 },
  { label: "LIFEHACK", pct: 58 },
];

const verticalSkills = [
  { label: "MUSIC & ART", pct: 88 },
  { label: "LIFEHACK", pct: 68 },
  { label: "FASHION", pct: 84 },
  { label: "LIFESTYLE", pct: 75 },
  { label: "INNOVATION", pct: 77 },
];

const topIcons: { label: string; Icon: LucideIcon }[] = [
  { label: "MUSIC & ART", Icon: Waves },
  { label: "LIFEHACK", Icon: MessageSquare },
  { label: "FASHION", Icon: User },
  { label: "LIFESTYLE", Icon: Trophy },
];

const sideIcons: { label: string; Icon: LucideIcon }[] = [
  { label: "LIFESTYLE", Icon: Heart },
  { label: "FASHION", Icon: Lightbulb },
  { label: "LIFEHACK", Icon: Rocket },
  { label: "MUSIC & ART", Icon: Gem },
];

function SemiCircle({ pct }: { pct: number }) {
  const r = 60;
  const c = Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg viewBox="0 0 140 80" className="w-full max-w-[160px] mx-auto">
      <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
      <path
        d="M 10 75 A 60 60 0 0 1 130 75"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="6"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CountersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Counters &amp; Progress Bars</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">COUNTERS &amp; PROGRESS BARS</span>
        </nav>
      </div>

      {/* Horizontal Progress Bars */}
      <section className="mb-12 pb-12 border-b border-border">
        <h2 className="text-xl font-serif italic mb-8">Horizontal Progress Bar</h2>
        <div className="space-y-5 mb-6">
          {horizontal.map((h) => (
            <div key={h.label}>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                <span>{h.label}</span>
                <span>{h.pct}%</span>
              </div>
              <div className="w-full bg-border h-1">
                <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${h.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
        </p>
        <div>
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
            <span>HEALTH &amp; BEAUTY</span>
            <span>70%</span>
          </div>
          <div className="w-full bg-border h-1">
            <div className="bg-primary h-full transition-all duration-1000" style={{ width: "70%" }} />
          </div>
        </div>
      </section>

      {/* Round Skills */}
      <section className="mb-12 pb-12 border-b border-border">
        <h2 className="text-xl font-serif italic mb-8">Round Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {roundSkills.map((s) => (
            <div key={s.label}>
              <SemiCircle pct={s.pct} />
              <p className="text-xs font-bold uppercase tracking-wider mt-3 mb-1">{s.label}</p>
              <p className="text-xs text-muted-foreground">Lorem ipsum amet, consectetur adipiscing phasellus.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vertical Skills */}
      <section className="mb-12 pb-12 border-b border-border">
        <h2 className="text-xl font-serif italic mb-8">Vertical Skills</h2>
        <div className="grid grid-cols-5 gap-6">
          {verticalSkills.map((s) => (
            <div key={s.label}>
              <div className="relative w-full aspect-[3/5] bg-secondary mb-3">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-1000"
                  style={{ height: `${s.pct * 0.15}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>{s.label}</span>
                <span>{s.pct}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Lorem ipsum amet, consectetur adipiscing phasellus.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Icons */}
      <section className="mb-12 pb-12 border-b border-border">
        <h2 className="text-xl font-serif italic mb-8">Top Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {topIcons.map(({ label, Icon }) => (
            <div key={label}>
              <Icon className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-3xl font-bold mb-1">0</p>
              <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Side Icons */}
      <section className="mb-12">
        <h2 className="text-xl font-serif italic mb-8">Side Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sideIcons.map(({ label, Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-2xl font-bold leading-none mb-0.5">0</p>
                <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
