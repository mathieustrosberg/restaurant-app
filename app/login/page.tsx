"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard"
    })
    if (error) setError(error.message || "Une erreur est survenue")
    else router.push("/dashboard")
  }

  return (
    <main>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email<br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Mot de passe<br />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Se connecter</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </main>
  )
}
