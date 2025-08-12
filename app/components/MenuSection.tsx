"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UtensilsCrossed, ChefHat, Utensils, Cookie } from 'lucide-react';

type Category = "entrees" | "plats" | "desserts";

type MenuItem = {
  name: string;
  description: string;
  price: string;
};

type MenuData = {
  category: string;
  items: MenuItem[];
};

const categoryIcons = {
  entrees: ChefHat,
  plats: Utensils,
  desserts: Cookie,
};

const categoryColors = {
  entrees: "bg-green-100 text-green-800 hover:bg-green-200",
  plats: "bg-blue-100 text-blue-800 hover:bg-blue-200", 
  desserts: "bg-pink-100 text-pink-800 hover:bg-pink-200",
};

export default function MenuSection() {
  const [selected, setSelected] = React.useState<Category>("entrees");
  const [menuData, setMenuData] = React.useState<MenuData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setMenuData(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du menu:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const currentCategory = menuData.find(cat => cat.category === selected);
  const currentItems = currentCategory?.items || [];

  const categories = [
    { key: "entrees" as Category, label: "Entrées", icon: ChefHat },
    { key: "plats" as Category, label: "Plats", icon: Utensils },
    { key: "desserts" as Category, label: "Desserts", icon: Cookie },
  ];

  return (
    <div className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="w-6 h-6 text-orange-600" />
          <CardTitle className="text-2xl">Notre Menu</CardTitle>
        </div>
        <CardDescription className="pt-3 pb-6">
          Découvrez nos spécialités culinaires préparées avec passion
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 space-y-6">
        {/* Category Selector */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selected === cat.key;
            return (
              <Button
                key={cat.key}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  isSelected 
                    ? "bg-orange-600 hover:bg-orange-700" 
                    : "hover:bg-orange-50 hover:border-orange-200"
                }`}
                onClick={() => setSelected(cat.key)}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const Icon = categoryIcons[selected];
                return (
                  <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4 text-orange-600" />
                            <h4 className="font-semibold text-lg">{item.name}</h4>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${categoryColors[selected]} font-semibold text-sm px-3 py-1`}
                        >
                          {item.price}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                  <UtensilsCrossed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucun plat disponible pour cette catégorie.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
}