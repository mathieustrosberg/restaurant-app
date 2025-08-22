import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('rend correctement avec le texte fourni', () => {
    render(<Button>Cliquez-moi</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Cliquez-moi')
  })

  it('applique la classe CSS par défaut', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('applique la variante correcte', () => {
    render(<Button variant="destructive">Supprimer</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('applique la taille correcte', () => {
    render(<Button size="lg">Grand bouton</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10')
  })

  it('gère les clics correctement', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Cliquez-moi</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('est désactivé quand la prop disabled est true', () => {
    render(<Button disabled>Bouton désactivé</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('applique les classes personnalisées', () => {
    render(<Button className="custom-class">Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})
