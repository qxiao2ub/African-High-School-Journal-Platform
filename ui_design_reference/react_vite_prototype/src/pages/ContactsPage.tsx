import { Link } from "react-router-dom";
import { User, MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import { articles } from "@/data/articles";
import { useState } from "react";

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const latestArticles = articles.slice(0, 10);

  const contactRows = [
    { icon: User, text: "Thomas Williams" },
    { icon: MapPin, text: "Brooklyn, 10036 New York\nUnited States" },
    { icon: Phone, text: "+1 222 333 444" },
    { icon: Mail, text: "contact@dailychronicle.com" },
    { icon: Globe, text: "dailychronicle.com" },
    { icon: Clock, text: "Monday - Friday: 7:30 am -\n17:00 pm, Saturday: 8:00 am -\n15:00 pm." },
  ];

  return (
    <div>
      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-3xl font-black font-serif uppercase tracking-tight">Contacts</h1>
        <div className="h-[3px] bg-primary w-full mt-3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Main content */}
        <div>
          {/* Map placeholder */}
          <div className="relative w-full aspect-[16/9] bg-secondary mb-8 overflow-hidden">
            <img
              src="https://picsum.photos/seed/map-placeholder/800/400?grayscale"
              alt="Map placeholder"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-background text-xs text-center py-2 px-4">
              This is a placeholder map for demonstration purposes. To display a real Google Map, use the Google Map Shortcode
            </div>
          </div>

          {/* Contact info + Form side by side */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Contact info */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-5">Contacts</h3>
              <div className="space-y-4">
                {contactRows.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm whitespace-pre-line leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {[
                { label: "YOUR NAME (REQUIRED)", key: "name" as const, type: "text" },
                { label: "YOUR EMAIL (REQUIRED)", key: "email" as const, type: "email" },
                { label: "SUBJECT", key: "subject" as const, type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    required={label.includes("REQUIRED")}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border-0 border-b border-input bg-transparent py-2 text-sm focus:outline-none focus:border-primary transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  YOUR MESSAGE
                </label>
                <textarea
                  rows={8}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-input bg-transparent p-3 text-sm focus:outline-none focus:border-primary transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar — Latest Articles */}
        <aside>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-5">Latest Articles</h3>
          <ul className="space-y-3">
            {latestArticles.map((a) => (
              <li key={a.id} className="flex items-start gap-2">
                <span className="text-foreground mt-1.5 text-[6px] leading-none">●</span>
                <Link
                  to={`/article/${a.id}`}
                  className="text-sm leading-snug hover:text-primary transition"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
