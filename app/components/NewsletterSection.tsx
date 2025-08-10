"use client";
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, CheckCircle, Sparkles, Users } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email) {
      setMessage("Veuillez saisir votre email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setMessage("Merci ! Vous êtes maintenant inscrit à notre newsletter.");
        setEmail("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur newsletter:", error);
      setMessage("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  }

  const isSuccess = message.includes("Merci");

  return (
    <div className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Mail className="w-6 h-6 text-orange-600" />
            <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
          </div>
          <CardTitle className="text-2xl">Newsletter</CardTitle>
        </div>
        <CardDescription>
          Restez informé de nos nouveautés, événements spéciaux et offres exclusives
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 space-y-6">
        {/* Benefits */}
        <div className="grid gap-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>Menus saisonniers en avant-première</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>Invitations aux événements exclusifs</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>Offres spéciales réservées aux abonnés</span>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg border flex items-center gap-3 ${
            isSuccess 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {isSuccess && <CheckCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Adresse email
            </label>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="votre@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex-1 border-orange-200 focus:border-orange-400"
              />
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Inscription...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">S&apos;inscrire</span>
                    <span className="sm:hidden">OK</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span>Pas de spam, uniquement du contenu de qualité. Désinscription facile.</span>
          </div>
        </form>

        {/* Stats Badge */}
        <div className="pt-4 border-t">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Users className="w-3 h-3 mr-1" />
            Plus de 1000 abonnés nous font confiance
          </Badge>
        </div>
      </CardContent>
    </div>
  );
}