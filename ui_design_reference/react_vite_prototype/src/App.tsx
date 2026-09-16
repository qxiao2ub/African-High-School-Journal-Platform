import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import HomeClassic from "./pages/HomeClassic";
import HomeVintage from "./pages/HomeVintage";
import CategoryPage from "./pages/CategoryPage";
import FashionPage from "./pages/FashionPage";
import FoodPage from "./pages/FoodPage";
import PoliticsPage from "./pages/PoliticsPage";
import OpinionPage from "./pages/OpinionPage";
import ContactsPage from "./pages/ContactsPage";
import BlogPage from "./pages/BlogPage";
import GalleryPage from "./pages/GalleryPage";
import ButtonsIconsPage from "./pages/ButtonsIconsPage";
import ClientsPage from "./pages/ClientsPage";
import CountersPage from "./pages/CountersPage";
import CustomCodePage from "./pages/CustomCodePage";
import DividersPage from "./pages/DividersPage";
import EmbeddedPage from "./pages/EmbeddedPage";
import FeaturedBlocksPage from "./pages/FeaturedBlocksPage";
import ArticlePage from "./pages/ArticlePage";
import StaffDetailPage from "./pages/StaffDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/home-classic" element={<HomeClassic />} />
            <Route path="/home-vintage" element={<HomeVintage />} />
            <Route path="/politics" element={<PoliticsPage />} />
            <Route path="/technology" element={<CategoryPage category="Technology" title="Technology" />} />
            <Route path="/sports" element={<CategoryPage category="Sports" title="Sports" />} />
            <Route path="/fashion" element={<FashionPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/opinion" element={<OpinionPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/:id" element={<StaffDetailPage />} />
            <Route path="/shortcodes/blog" element={<BlogPage />} />
            <Route path="/shortcodes/buttons-icons" element={<ButtonsIconsPage />} />
            <Route path="/shortcodes/clients" element={<ClientsPage />} />
            <Route path="/shortcodes/counters" element={<CountersPage />} />
            <Route path="/shortcodes/custom-code" element={<CustomCodePage />} />
            <Route path="/shortcodes/dividers" element={<DividersPage />} />
            <Route path="/shortcodes/embedded" element={<EmbeddedPage />} />
            <Route path="/shortcodes/featured-blocks" element={<FeaturedBlocksPage />} />
            <Route path="/shortcodes/gallery" element={<GalleryPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
