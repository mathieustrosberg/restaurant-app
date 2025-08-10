"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { ChefHat } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps extends React.ComponentProps<"div"> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    })

    setLoading(false)

    if (error) setError(error.message || "Une erreur est survenue")
    else router.push("/dashboard")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          {/* Entête logo + titre */}
          <div className="flex flex-col items-center gap-2">
            <a href="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <ChefHat className="size-6" />
              </div>
              <span className="sr-only">Mon Restaurant</span>
            </a>
            <h1 className="text-xl font-bold">Connexion</h1>
          </div>

          {/* Champs email + password + bouton submit */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@restaurant.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </Button>

            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Accès réservé aux administrateurs
          </div>
        </div>
      </form>

      {/* Mentions légales */}
      <div className="text-muted-foreground text-center text-xs">
        En vous connectant, vous acceptez nos{" "}
        <a href="/mentions-legales" className="underline underline-offset-4">Mentions légales</a> et notre{" "}
        <a href="/politique-de-confidentialite" className="underline underline-offset-4">Politique de confidentialité</a>.
      </div>
    </div>
  )
}
