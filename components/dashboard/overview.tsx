"use client"

import { CalendarDays, ChefHat, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useContent } from "@/lib/hooks/useContent"

export function Overview() {
  const { content, loading } = useContent()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const menuItemsCount = content?.menuSection?.items?.length || 0
  const lastUpdated = content?.updatedAt ? new Date(content.updatedAt).toLocaleDateString('fr-FR') : 'Jamais'
  const categories = content?.menuSection?.items?.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre restaurant Loon Garden
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des plats
            </CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItemsCount}</div>
            <p className="text-xs text-muted-foreground">
              plats dans le menu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entrées
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.entree || 0}</div>
            <p className="text-xs text-muted-foreground">
              entrées disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plats principaux
            </CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.plat || 0}</div>
            <p className="text-xs text-muted-foreground">
              plats principaux
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desserts
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.dessert || 0}</div>
            <p className="text-xs text-muted-foreground">
              desserts au menu
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aperçu du contenu</CardTitle>
            <CardDescription>
              État actuel du contenu de votre site web
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Section Hero</span>
                <Badge variant="secondary">Configuré</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {content?.heroSection?.title} {content?.heroSection?.subtitle}
                <span className="font-medium">{content?.heroSection?.highlightText}</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bannière d'information</span>
                <Badge variant="secondary">Configuré</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {content?.infoBanner?.text?.slice(0, 100)}...
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Section Menu</span>
                <Badge variant="secondary">{menuItemsCount} plats</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {content?.menuSection?.title}
                <span className="font-medium">{content?.menuSection?.highlightText}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Dernières activités</CardTitle>
            <CardDescription>
              Historique des modifications récentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Contenu mis à jour
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dernière modification: {lastUpdated}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Système initialisé
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Base de données configurée
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 