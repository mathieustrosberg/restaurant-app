import { cn } from './utils';

describe('utils', () => {
  describe('cn function', () => {
    test('combines class names correctly', () => {
      const result = cn('bg-red-500', 'text-white');
      expect(result).toBe('bg-red-500 text-white');
    });

    test('handles empty strings', () => {
      const result = cn('', 'text-white', '');
      expect(result).toBe('text-white');
    });

    test('handles undefined and null values', () => {
      const result = cn('bg-red-500', undefined, null, 'text-white');
      expect(result).toBe('bg-red-500 text-white');
    });

    test('handles conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      );
      expect(result).toBe('base-class active-class');
    });

    test('merges conflicting Tailwind classes correctly', () => {
      // tailwind-merge should handle this
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    test('handles arrays of class names', () => {
      const result = cn(['bg-red-500', 'text-white'], 'p-4');
      expect(result).toBe('bg-red-500 text-white p-4');
    });

    test('handles objects with boolean values', () => {
      const result = cn({
        'bg-red-500': true,
        'text-white': false,
        'p-4': true
      });
      expect(result).toBe('bg-red-500 p-4');
    });

    test('handles no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    test('handles complex combinations', () => {
      const isError = true;
      const size = 'large';
      const result = cn(
        'base-button',
        {
          'error-state': isError,
          'success-state': !isError
        },
        size === 'large' && 'text-lg',
        ['rounded', 'shadow']
      );
      expect(result).toBe('base-button error-state text-lg rounded shadow');
    });

    test('handles whitespace correctly', () => {
      const result = cn('  bg-red-500  ', '\n text-white \t');
      expect(result).toBe('bg-red-500 text-white');
    });
  });
});