import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('combine les classes correctement', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('gère les classes conditionnelles', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('gère les valeurs undefined et null', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toBe('base valid')
    })

    it('gère les classes conflictuelles avec tailwind-merge', () => {
      const result = cn('px-2', 'px-4')
      expect(result).toBe('px-4')
    })

    it('retourne une chaîne vide pour des entrées vides', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})
