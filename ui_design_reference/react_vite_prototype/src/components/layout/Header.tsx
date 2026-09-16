import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import sealImg from "../../assets/journal-seal.png";

const topLinks = [
  { label: "HOME", to: "/" },
  { label: "NEWS & ANALYSIS", to: "/politics" },
  { label: "OPINION & DEBATE", to: "/opinion" },
  { label: "CONTACT", to: "/contacts" },
];

const mainNav = [
  { label: "HOME", to: "/" },
  { label: "NEWS & ANALYSIS", to: "/politics" },
  { label: "SCIENCE & TECH", to: "/technology" },
  { label: "SPORT", to: "/sports" },
  { label: "ARTS & CULTURE", to: "/fashion" },
  { label: "CAMPUS LIFE", to: "/food" },
  { label: "ESSAYS", to: "/shortcodes/blog" },
  { label: "GALLERY", to: "/shortcodes/gallery" },
  { label: "CONTACT", to: "/contacts" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-background sticky top-0 z-50">
      {/* Top bar — slim, muted */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8 text-[11px] text-muted-foreground tracking-wide">
          <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          <nav className="hidden md:flex items-center gap-5">
            {topLinks.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                className="hover:text-primary transition font-semibold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Masthead — seal + balanced serif wordmark */}
      <div className="py-5 border-b border-border">
        <Link to="/" className="flex items-center justify-center gap-4 md:gap-5 px-4">
          <img
            src={sealImg}
            alt="Seal of The African High School Research Journal"
            className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-2 border-gold shadow-sm"
          />
          <span className="text-left">
            <span className="block text-[15px] md:text-[19px] font-serif italic tracking-[0.22em] text-accent mb-[-3px]">
              The African
            </span>
            <span className="block text-[1.55rem] md:text-[2.35rem] font-black font-serif tracking-tight leading-[0.95] uppercase text-primary">
              High School Research Journal
            </span>
            <span className="block text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-muted-foreground mt-1">
              Student Research Across the Continent
            </span>
          </span>
        </Link>
      </div>

      {/* Main nav — clean row with active underline */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <nav className="hidden lg:flex items-center gap-0">
            {mainNav.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  className={`relative text-[12px] font-semibold tracking-wider uppercase px-4 py-3 transition hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 py-2 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-b border-border py-3 px-4 max-w-7xl mx-auto">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full border border-input rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-b border-border bg-background">
          {mainNav.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-3 text-xs font-semibold tracking-wider uppercase border-b border-border hover:text-primary transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
