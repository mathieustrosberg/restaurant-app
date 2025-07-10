"use client"

import { createAuthClient } from "better-auth/react"
import { redirect } from "next/navigation"
import ContentEditor from "@/components/dashboard/content-editor"

const { useSession, signOut } = createAuthClient()

export default function DashboardPage() {
  const { data: session, isPending } = useSession()

  // Redirection si pas de session (côté client)
  if (!isPending && (!session || session.user.email !== "admin@loon-garden.com")) {
    redirect("/login")
  }

  // Affichage loading pendant le chargement
  if (isPending) {
    return (
      <main style={{ padding: "20px", textAlign: "center" }}>
        <p>Chargement...</p>
      </main>
    )
  }

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login" // Redirection après déconnexion
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du dashboard */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Tableau de bord - Loon Garden
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Connecté en tant que <strong>{session?.user.email}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <ContentEditor />
          </div>
        </div>
      </main>
    </div>
  )
}
