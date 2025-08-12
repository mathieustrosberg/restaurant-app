"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de désabonnement manquant");
      setLoading(false);
      return;
    }

    // Vérifier la validité du token
    fetch(`/api/unsubscribe?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setEmail(data.email);
        } else {
          setError(data.error || "Token invalide");
        }
      })
      .catch(() => {
        setError("Erreur lors de la vérification");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setProcessing(true);
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setUnsubscribed(true);
      } else {
        setError(data.error || "Erreur lors du désabonnement");
      }
    } catch (error) {
      setError("Erreur lors du désabonnement");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Vérification en cours...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {unsubscribed ? (
            <>
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-green-800">Désabonnement réussi</CardTitle>
              <CardDescription>
                Vous avez été désabonné de notre newsletter
              </CardDescription>
            </>
          ) : error ? (
            <>
              <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Erreur</CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Désabonnement Newsletter</CardTitle>
              <CardDescription>
                Confirmez-vous vouloir vous désabonner ?
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {unsubscribed ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                <strong>{email}</strong> a été retiré de notre liste de diffusion.
              </p>
              <p className="text-sm text-gray-600">
                Vous recevrez un email de confirmation sous peu.
              </p>
              <p className="text-sm text-gray-600">
                Vous pouvez toujours vous réabonner sur notre site si vous changez d'avis.
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Le lien de désabonnement semble invalide ou expiré.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Email : <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Vous ne recevrez plus nos newsletters après confirmation.
                </p>
              </div>
              
              <Button 
                onClick={handleUnsubscribe}
                disabled={processing}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {processing ? "Désabonnement..." : "Confirmer le désabonnement"}
              </Button>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Link href="/" className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
