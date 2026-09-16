import { Link } from "react-router-dom";
import {
  ThumbsUp, User, MessageCircle, Globe, Rocket,
  Flame, MapPin, Settings, Camera, Gift,
  Compass, Mail, Send, Layers,
  LifeBuoy, Plane, Anchor, Trophy, Gamepad2, Gem,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Button grid rows ── */
const btnRows: { filled: boolean; icon?: boolean; sizes?: boolean }[] = [
  { filled: true },
  { filled: true, sizes: true },
  { filled: true, icon: true },
  { filled: true },
  { filled: true, icon: true },
];

/* ── Icon grid ── */
const iconList: LucideIcon[] = [
  ThumbsUp, Flame, Anchor, Trophy,
  User, MapPin, Compass, Plane,
  MessageCircle, Settings, Mail, Layers,
  Globe, Camera, Gem, LifeBuoy,
  Rocket, Gift, Send, Gamepad2,
];

export default function ButtonsIconsPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title + Breadcrumb */}
        <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
          <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Buttons &amp; Icons</h1>
          <nav className="text-[11px] tracking-wide text-muted-foreground">
            <Link to="/" className="hover:text-primary transition">HOME</Link>
            <span className="mx-2">|</span>
            <span className="text-foreground font-bold">BUTTONS &amp; ICONS</span>
          </nav>
        </div>

        {/* Buttons section */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-10">
            Unlimited Button Styles. Any Size, Color, Font, Width, Height and Icons. Well Animated.
          </h2>

          {/* Row 1 — filled + outlined */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">Button</button>
            <button className="border border-primary text-primary px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition">Button</button>
            <button className="border border-border text-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition">Button</button>
            <button className="border border-border text-primary px-5 py-2 text-xs font-bold uppercase tracking-wider hover:border-primary transition">Button</button>
          </div>

          {/* Row 2 — size variations */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <button className="bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">Button</button>
            <button className="border border-primary text-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition">Button</button>
            <button className="border border-border text-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition flex items-center justify-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Button
            </button>
            <button className="border border-border text-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:border-primary transition flex items-center justify-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Button
            </button>
          </div>

          {/* Row 3 — filled with icons + outlined plain */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Button
            </button>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Button
            </button>
            <button className="border border-border text-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition">Button</button>
            <button className="border border-border text-primary px-5 py-2 text-xs font-bold uppercase tracking-wider hover:border-primary transition">Button</button>
          </div>

          {/* Row 4 — all filled primary */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">Button</button>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">Button</button>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">Button</button>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">Button</button>
          </div>

          {/* Row 5 — with icons, mixed */}
          <div className="grid grid-cols-4 gap-6">
            <button className="border border-primary text-primary px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Button
            </button>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Button
            </button>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Button
            </button>
            <button className="bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Button
            </button>
          </div>
        </section>
      </div>

      {/* Icons section — gray background */}
      <section className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-serif mb-10">2000 + Icons with flexible settings</h2>
          <div className="grid grid-cols-4 gap-y-8 gap-x-6">
            {iconList.map((Icon, i) => {
              const col = i % 4;
              if (col === 0) {
                // Line icons
                return (
                  <div key={i} className="flex justify-center">
                    <Icon className="w-8 h-8 text-foreground" />
                  </div>
                );
              }
              if (col === 1) {
                // Filled black circles
                return (
                  <div key={i} className="flex justify-center">
                    <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-background" />
                    </div>
                  </div>
                );
              }
              if (col === 2) {
                // Filled dark rounded squares
                return (
                  <div key={i} className="flex justify-center">
                    <div className="w-10 h-10 bg-foreground rounded-md flex items-center justify-center">
                      <Icon className="w-5 h-5 text-background" />
                    </div>
                  </div>
                );
              }
              // Filled black rounded squares
              return (
                <div key={i} className="flex justify-center">
                  <div className="w-10 h-10 bg-foreground rounded-md flex items-center justify-center">
                    <Icon className="w-5 h-5 text-background" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
