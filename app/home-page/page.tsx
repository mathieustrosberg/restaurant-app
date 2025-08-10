"use client";
import React from 'react'
import ReservationSection from '../components/ReservationSection'
import MenuSection from '../components/MenuSection'
import NewsletterSection from '../components/NewsletterSection'
import ContactSection from '../components/ContactSection'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { UtensilsCrossed, Clock, Phone, Mail } from 'lucide-react'

type ContentSection = {
  type: string;
  value: {
    text?: string;
    src?: string;
    alt?: string;
  };
};

type ContentData = {
  sections: ContentSection[];
};

const HomePage = () => {
  const [content, setContent] = React.useState<ContentData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/content/home", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du contenu:", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const titleSection = content?.sections?.find(s => s.type === "title");
  const paragraphSection = content?.sections?.find(s => s.type === "paragraph");
  const imageSection = content?.sections?.find(s => s.type === "image");

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Restaurant Gastronomique
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {titleSection?.value?.text || "Mon Restaurant"}
              </h1>
              <p className="text-xl text-orange-100 max-w-lg leading-relaxed">
                {paragraphSection?.value?.text || "Bienvenue dans notre restaurant où tradition et modernité se rencontrent pour une expérience culinaire unique."}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Ouvert 7j/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>01 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@restaurant.fr</span>
                </div>
              </div>
            </div>
            
            {imageSection?.value?.src && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-transparent rounded-2xl"></div>
                <img 
                  src={imageSection.value.src} 
                  alt={imageSection.value.alt || "Restaurant"} 
                  className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Menu Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-0">
              <MenuSection />
            </CardContent>
          </Card>

          {/* Reservation Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-0">
              <ReservationSection />
            </CardContent>
          </Card>
        </div>

        {/* Newsletter & Contact */}
        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-0">
              <NewsletterSection />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-0">
              <ContactSection />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage