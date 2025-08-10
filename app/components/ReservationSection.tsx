"use client";
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, Users, CheckCircle, Phone, Mail, User } from 'lucide-react';

type Service = "lunch" | "dinner";

const LUNCH_SLOTS = ["11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30"];
const DINNER_SLOTS = ["18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30"];

export default function ReservationSection() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [date, setDate] = React.useState<string>("");
  const [people, setPeople] = React.useState<number>(2);
  const [service, setService] = React.useState<Service>("lunch");
  const [time, setTime] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const slots = service === "lunch" ? LUNCH_SLOTS : DINNER_SLOTS;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time || !people) {
      setMsg("Merci de remplir tous les champs et de choisir un créneau.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, date, time, service, people, notes })
      });

      if (res.ok) {
        setMsg("Merci ! Vous allez recevoir un email de confirmation pour votre réservation.");
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setPeople(2);
        setTime(null);
        setNotes("");
      } else {
        const data = await res.json();
        setMsg(data?.error || "Erreur lors de la réservation.");
      }
    } catch (error) {
      console.error("Erreur réservation:", error);
      setMsg("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMsg(""), 5000);
    }
  }

  const isSuccess = msg.includes("Merci");

  return (
    <div className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-orange-600" />
          <CardTitle className="text-2xl">Réservation</CardTitle>
        </div>
        <CardDescription>
          Réservez votre table en quelques clics. Nous vous confirmerons par email.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 space-y-6">
        {msg && (
          <div className={`p-4 rounded-lg border flex items-center gap-3 ${
            isSuccess 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {isSuccess && <CheckCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{msg}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" />
                Nom complet
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-600" />
                Téléphone
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01 23 45 67 89"
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                Nombre de personnes
              </label>
              <Select value={people.toString()} onValueChange={(value) => setPeople(Number(value))}>
                <SelectTrigger className="border-orange-200 focus:border-orange-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "personne" : "personnes"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-orange-600" />
              Date de réservation
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Service Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Service souhaité
            </label>
            <div className="flex gap-3">
              {[
                { key: "lunch", label: "Déjeuner", time: "12h00 - 14h00" },
                { key: "dinner", label: "Dîner", time: "19h00 - 22h00" }
              ].map((s) => (
                <Button
                  key={s.key}
                  type="button"
                  variant={service === s.key ? "default" : "outline"}
                  onClick={() => {
                    setService(s.key as Service);
                    setTime(null); // Reset time when changing service
                  }}
                  className={`flex-1 h-auto py-3 px-4 ${
                    service === s.key 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "hover:bg-orange-50 hover:border-orange-200"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs opacity-75">{s.time}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Créneaux disponibles pour le {service === "lunch" ? "déjeuner" : "dîner"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={time === slot ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTime(slot)}
                  className={time === slot 
                    ? "bg-orange-600 hover:bg-orange-700" 
                    : "hover:bg-orange-50 hover:border-orange-200"
                  }
                >
                  {slot}
                </Button>
              ))}
            </div>
            {time && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Créneau sélectionné : {time}
              </Badge>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Notes additionnelles (optionnel)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, préférences de table, occasion spéciale..."
              className="min-h-[80px] border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !time}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 h-12"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Réservation en cours...
              </>
            ) : (
              <>
                <CalendarDays className="w-4 h-4 mr-2" />
                Confirmer la réservation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </div>
  );
}