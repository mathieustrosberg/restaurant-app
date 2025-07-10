"use client"

import { useState } from "react"
import { createAuthClient } from "better-auth/react"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Header } from "@/components/dashboard/header"
import { Overview } from "@/components/dashboard/overview"
import ContentEditor from "@/components/dashboard/content-editor"
import NewsletterManager from "@/components/dashboard/newsletter-manager"
import MenuManager from "@/components/dashboard/menu-manager"

const { useSession, signOut } = createAuthClient()

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const [activeSection, setActiveSection] = useState("accueil")

  // Redirection si pas de session (côté client)
  if (!isPending && (!session || session.user.email !== "admin@loon-garden.com")) {
    redirect("/login")
  }

  // Affichage loading pendant le chargement
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login"
        }
      }
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case "accueil":
        return <Overview />
      case "contenu":
        return <ContentEditor />
      case "menu":
        return <MenuManager />
      case "newsletter":
        return <NewsletterManager />
      case "réservations":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Réservations</h2>
            <p className="text-muted-foreground">Gestion des réservations et disponibilités.</p>
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Fonctionnalité à venir</p>
            </div>
          </div>
        )
      case "statistiques":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Statistiques</h2>
            <p className="text-muted-foreground">Analyse des performances et données du restaurant.</p>
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Fonctionnalité à venir</p>
            </div>
          </div>
        )
      case "paramètres":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
            <p className="text-muted-foreground">Configuration générale de l'application.</p>
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Fonctionnalité à venir</p>
            </div>
          </div>
        )
      default:
        return <Overview />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            user={session?.user}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
