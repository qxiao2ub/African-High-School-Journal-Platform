import { useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem("cookie-accepted"); } catch { return true; }
  });

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <p className="text-xs text-muted-foreground">
          This website uses cookies to improve your experience. We'll assume you're ok with this, but you can opt-out if you wish.
        </p>
        <button
          onClick={() => {
            try { localStorage.setItem("cookie-accepted", "1"); } catch {}
            setVisible(false);
          }}
          className="border border-foreground text-foreground px-4 py-1 rounded text-xs font-semibold hover:bg-foreground hover:text-background transition flex-shrink-0"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
