import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { House, ArrowLeft, Utensils } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Icône de restaurant stylisée */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-4">
            <Utensils className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        {/* Titre 404 */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        {/* Message principal */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Oops ! Cette page n'existe pas
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Il semblerait que la page que vous cherchez ait été déplacée ou n'existe plus. 
          Mais ne vous inquiétez pas, notre menu vous attend !
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild className="inline-flex items-center gap-2">
            <Link href="/">
              <House className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="inline-flex items-center gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4" />
              Page précédente
            </Link>
          </Button>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Vous cherchez peut-être :</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="text-orange-600 hover:text-orange-700 hover:underline">
              Accueil
            </Link>
            <Link href="/" className="text-orange-600 hover:text-orange-700 hover:underline">
              Notre menu
            </Link>
            <Link href="/" className="text-orange-600 hover:text-orange-700 hover:underline">
              Réservations
            </Link>
            <Link href="/" className="text-orange-600 hover:text-orange-700 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
