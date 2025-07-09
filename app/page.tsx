import Loader from "@/components/loader";
import HeroSection from "@/components/hero-section";
import InfoBanner from "@/components/info-banner";
import ImageHighlight from "@/components/image-highlight";
import MenuSection from "@/components/menu-section";
import Footer from "@/components/footer"; 

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <main className="flex-1">
        <Loader />
    <HeroSection />
    <InfoBanner />
    <ImageHighlight />
    <MenuSection />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
