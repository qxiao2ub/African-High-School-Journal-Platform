import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="border-t border-border py-8">
      <div className="max-w-lg mx-auto text-center px-4">
        <h3 className="font-serif text-base font-bold mb-4">
          Sign up for the Spotlight Newsletter:
        </h3>
        <form
          onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
          className="flex"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address *"
            className="flex-1 border border-input px-4 py-2 text-sm rounded-l focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-r font-bold text-xs uppercase tracking-wider hover:opacity-90 transition"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </section>
  );
}
