import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Page 404', () => {
  it('rend le titre 404', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
  })

  it('affiche le message d\'erreur principal', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Cette page n\'existe pas')
  })

  it('affiche la description explicative', () => {
    render(<NotFound />)
    expect(screen.getByText(/Il semblerait que la page que vous cherchez/)).toBeInTheDocument()
  })

  it('affiche le bouton de retour à l\'accueil', () => {
    render(<NotFound />)
    const homeButton = screen.getByRole('link', { name: /Retour à l'accueil/ })
    expect(homeButton).toBeInTheDocument()
    expect(homeButton).toHaveAttribute('href', '/')
  })

  it('affiche le bouton de page précédente', () => {
    render(<NotFound />)
    const backButton = screen.getByRole('link', { name: /Page précédente/ })
    expect(backButton).toBeInTheDocument()
  })

  it('affiche tous les liens de navigation utiles', () => {
    render(<NotFound />)
    
    // Vérifier la présence des liens principaux
    expect(screen.getByRole('link', { name: /Accueil/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Notre menu/ })).toHaveAttribute('href', '/menu')
    expect(screen.getByRole('link', { name: /Réservations/ })).toHaveAttribute('href', '/reservations')
    expect(screen.getByRole('link', { name: /Contact/ })).toHaveAttribute('href', '/contact')
  })

  it('affiche l\'icône de restaurant', () => {
    render(<NotFound />)
    // Vérifier la présence d'un élément SVG (icône)
    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('applique les classes CSS appropriées', () => {
    render(<NotFound />)
    const container = screen.getByText('404').closest('div')
    expect(container).toHaveClass('text-center')
  })

  it('contient le texte d\'aide pour les utilisateurs', () => {
    render(<NotFound />)
    expect(screen.getByText('Vous cherchez peut-être :')).toBeInTheDocument()
  })
})
