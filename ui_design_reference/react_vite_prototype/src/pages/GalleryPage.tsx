import { articles } from "@/data/articles";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

const sliderImages = articles.slice(0, 5).map((a) => a.image);
const hoverImages = articles.slice(5, 8).map((a) => a.image);
const galleryImages = articles.slice(0, 12).map((a) => a.image);

export default function GalleryPage() {
  const [sliderIdx, setSliderIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title + Breadcrumb */}
      <div className="flex items-end justify-between border-b border-border pb-4 mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight">Gallery</h1>
        <nav className="text-[11px] tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">HOME</Link>
          <span className="mx-2">|</span>
          <span className="text-foreground font-bold">GALLERY</span>
        </nav>
      </div>

      {/* Two-column: Slider + Hover Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Slider */}
        <div>
          <h2 className="text-xl font-serif italic mb-6">Slider</h2>
          <div className="relative">
            <img
              src={sliderImages[sliderIdx]}
              alt={`Slide ${sliderIdx + 1}`}
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
            <button
              onClick={() => setSliderIdx((sliderIdx - 1 + sliderImages.length) % sliderImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-background/80 flex items-center justify-center hover:bg-background transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSliderIdx((sliderIdx + 1) % sliderImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-background/80 flex items-center justify-center hover:bg-background transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hover Slider */}
        <div>
          <h2 className="text-xl font-serif italic mb-6">Hover Slider</h2>
          <img
            src={hoverImages[hoverIdx]}
            alt={`Hover ${hoverIdx + 1}`}
            className="w-full aspect-[4/3] object-cover mb-3"
            loading="lazy"
          />
          <div className="flex gap-2">
            {hoverImages.map((img, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoverIdx(i)}
                onClick={() => setHoverIdx(i)}
                className={`flex-1 aspect-[3/2] overflow-hidden border-2 transition ${
                  i === hoverIdx ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xl font-serif italic mb-6">Image Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden cursor-pointer"
              onClick={() => setLightbox(i)}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-foreground/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-background"><X className="w-8 h-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + galleryImages.length) % galleryImages.length); }} className="absolute left-4 text-background"><ChevronLeft className="w-8 h-8" /></button>
          <img src={galleryImages[lightbox]} alt="" className="max-w-full max-h-[80vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % galleryImages.length); }} className="absolute right-4 text-background"><ChevronRight className="w-8 h-8" /></button>
        </div>
      )}
    </div>
  );
}
