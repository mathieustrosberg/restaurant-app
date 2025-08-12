"use client";
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, CheckCircle, User, Mail, FileText, MessageCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessage("Tous les champs sont requis");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur contact:", error);
      setMessage("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isSuccess = message.includes("succès");

  return (
    <div className="p-6">
      <CardHeader className="px-0 pt-3 pb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-orange-600" />
          <CardTitle className="text-2xl">Contactez-nous</CardTitle>
        </div>
        <CardDescription>
          Une question, une suggestion ou une demande spéciale ? Nous serions ravis de vous entendre !
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 space-y-6">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" />
                Nom complet
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                disabled={isLoading}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" />
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                disabled={isLoading}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              Sujet
            </label>
            <Input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Réservation, menu, événement privé..."
              required
              disabled={isLoading}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              Message
            </label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez votre demande en détail..."
              required
              disabled={isLoading}
              className="min-h-[120px] border-orange-200 focus:border-orange-400"
            />
            <div className="text-xs text-muted-foreground">
              {formData.message.length}/1000 caractères
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 h-12"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer le message
              </>
            )}
          </Button>
        </form>

        {/* Additional Info */}
        <div className="pt-4 border-t">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <MessageSquare className="w-3 h-3 mr-1" />
            Vos données sont protégées et ne seront jamais partagées
          </Badge>
        </div>
      </CardContent>
    </div>
  );
}