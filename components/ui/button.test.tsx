import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, buttonVariants } from './button';

describe('Button Component', () => {
  describe('Basic functionality', () => {
    test('renders button with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-slot', 'button');
    });

    test('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    test('forwards additional props', () => {
      render(<Button type="submit" disabled>Submit</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toBeDisabled();
    });
  });

  describe('Variants', () => {
    test('renders default variant correctly', () => {
      render(<Button variant="default">Default</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    test('renders destructive variant correctly', () => {
      render(<Button variant="destructive">Delete</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'text-white');
    });

    test('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'bg-background');
    });

    test('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    test('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent');
    });

    test('renders link variant correctly', () => {
      render(<Button variant="link">Link</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary', 'underline-offset-4');
    });
  });

  describe('Sizes', () => {
    test('renders default size correctly', () => {
      render(<Button size="default">Default Size</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'px-4', 'py-2');
    });

    test('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3');
    });

    test('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-6');
    });

    test('renders icon size correctly', () => {
      render(<Button size="icon">🔥</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-9');
    });
  });

  describe('asChild prop', () => {
    test('renders as Slot when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      
      const link = screen.getByRole('link', { name: 'Link Button' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-slot', 'button');
    });

    test('renders as button when asChild is false', () => {
      render(<Button asChild={false}>Normal Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Normal Button' });
      expect(button).toBeInTheDocument();
    });

    test('defaults to button element when asChild is not provided', () => {
      render(<Button>Default Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Default Button' });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Accessibility', () => {
    test('supports aria-label', () => {
      render(<Button aria-label="Close modal">×</Button>);
      
      const button = screen.getByRole('button', { name: 'Close modal' });
      expect(button).toBeInTheDocument();
    });

    test('supports aria-describedby', () => {
      render(
        <>
          <Button aria-describedby="help-text">Submit</Button>
          <div id="help-text">This will submit the form</div>
        </>
      );
      
      const button = screen.getByRole('button', { name: 'Submit' });
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('handles disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    test('supports keyboard navigation', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
      
      // Buttons respond to space and enter keys, but fireEvent.keyDown doesn't trigger onClick
      // We test that focus works and the button is keyboard accessible
      fireEvent.keyDown(button, { key: 'Enter' });
      // Note: keyDown doesn't automatically trigger onClick in JSDOM
      expect(button).toHaveFocus();
    });
  });

  describe('Edge cases', () => {
    test('handles empty children', () => {
      render(<Button></Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    test('handles multiple children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toContainHTML('<span>Icon</span><span>Text</span>');
    });

    test('combines variant and size classes correctly', () => {
      render(<Button variant="destructive" size="lg">Large Destructive</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'h-10', 'px-6');
    });

    test('overrides default classes with custom className', () => {
      render(<Button className="bg-custom text-custom">Custom</Button>);
      
      const button = screen.getByRole('button');
      // Should still have base classes and custom classes
      expect(button).toHaveClass('bg-custom', 'text-custom');
      expect(button).toHaveClass('inline-flex', 'items-center'); // Base classes
    });

    test('handles null/undefined variant gracefully', () => {
      // @ts-ignore - Testing runtime behavior
      render(<Button variant={null}>Null Variant</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Focus and interaction states', () => {
    test('applies focus-visible styles', () => {
      render(<Button>Focus Test</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-ring/50');
    });

    test('applies hover styles for variants', () => {
      render(<Button variant="default">Hover Test</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-primary/90');
    });

    test('handles transition classes', () => {
      render(<Button>Transition Test</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all');
    });
  });
});

describe('buttonVariants function', () => {
  test('returns correct classes for default variant and size', () => {
    const classes = buttonVariants();
    
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
    expect(classes).toContain('h-9');
    expect(classes).toContain('px-4');
  });

  test('returns correct classes for specific variant', () => {
    const classes = buttonVariants({ variant: 'destructive' });
    
    expect(classes).toContain('bg-destructive');
    expect(classes).toContain('text-white');
  });

  test('returns correct classes for specific size', () => {
    const classes = buttonVariants({ size: 'lg' });
    
    expect(classes).toContain('h-10');
    expect(classes).toContain('px-6');
  });

  test('combines variant and size correctly', () => {
    const classes = buttonVariants({ variant: 'outline', size: 'sm' });
    
    expect(classes).toContain('border');
    expect(classes).toContain('bg-background');
    expect(classes).toContain('h-8');
    expect(classes).toContain('px-3');
  });

  test('includes additional className', () => {
    const classes = buttonVariants({ className: 'custom-class' });
    
    expect(classes).toContain('custom-class');
    expect(classes).toContain('bg-primary'); // Default variant
  });

  test('handles all variant combinations', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    variants.forEach(variant => {
      sizes.forEach(size => {
        const classes = buttonVariants({ variant, size });
        expect(typeof classes).toBe('string');
        expect(classes.length).toBeGreaterThan(0);
      });
    });
  });
});