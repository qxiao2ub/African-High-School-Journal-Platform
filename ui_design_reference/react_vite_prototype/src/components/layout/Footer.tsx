import { Facebook, Instagram, Twitter } from "lucide-react";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer>
      <Newsletter />
      <div className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground tracking-wide">
            The African High School Research Journal © 2026 / All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
