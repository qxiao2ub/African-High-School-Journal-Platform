import { useParams, Link } from "react-router-dom";
import { getStaffById, staff } from "@/data/staff";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowLeft } from "lucide-react";

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const member = getStaffById(id || "");

  if (!member) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-border">404</h1>
          <p className="text-xl font-serif mt-4 mb-6">Staff member not found.</p>
          <Link to="/contacts" className="text-primary font-semibold hover:underline">Back to Contacts</Link>
        </div>
      </div>
    );
  }

  // Get articles matching this staff member's department
  const memberArticles = articles
    .filter((a) => a.category.some((c) => c.toLowerCase() === member.department.toLowerCase()))
    .slice(0, 6);

  const iconMap: Record<string, React.ElementType> = {
    Twitter, Facebook, Instagram, LinkedIn: Linkedin,
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link to="/contacts" className="hover:text-primary transition">Contacts</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{member.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar / Card */}
        <aside className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md overflow-hidden sticky top-24">
            <img src={member.avatar} alt={member.name} className="w-full aspect-square object-cover" />
            <div className="p-6">
              <h1 className="text-2xl font-bold font-serif">{member.name}</h1>
              <p className="text-primary font-semibold text-sm mt-1">{member.role}</p>
              <p className="text-muted-foreground text-sm">{member.department} Department</p>

              <div className="border-t border-border mt-4 pt-4 space-y-3">
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
                  <Mail className="w-4 h-4" /> {member.email}
                </a>
                <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
                  <Phone className="w-4 h-4" /> {member.phone}
                </a>
              </div>

              <div className="border-t border-border mt-4 pt-4 flex gap-3">
                {member.socialLinks.map((link) => {
                  const Icon = iconMap[link.platform] || Twitter;
                  return (
                    <a key={link.platform} href={link.url} className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition">
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              <div className="border-t border-border mt-4 pt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{member.articlesWritten}</p>
                  <p className="text-xs text-muted-foreground">Articles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{member.yearsAtPaper}</p>
                  <p className="text-xs text-muted-foreground">Years</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold font-serif mb-6">About {member.name}</h2>
          {member.bio.map((p, i) => (
            <p key={i} className="text-foreground leading-relaxed mb-5">{p}</p>
          ))}

          <div className="mt-8 mb-10">
            <h3 className="text-lg font-bold font-serif mb-3">Areas of Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {member.specialties.map((s) => (
                <span key={s} className="inline-block bg-secondary text-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Articles by this author */}
          {memberArticles.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold font-serif mb-6 border-b-2 border-primary pb-2">
                ARTICLES IN {member.department.toUpperCase()}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memberArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
