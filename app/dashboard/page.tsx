"use client"

import { createAuthClient } from "better-auth/react"
import { redirect } from "next/navigation"

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
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Tableau de bord</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Déconnexion
        </button>
      </div>
      
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
        <p>Bienvenue, <strong>{session?.user.email}</strong> ! (Admin)</p>
        <p>Vous êtes connecté au tableau de bord administrateur.</p>
      </div>
    </main>
  )
}
