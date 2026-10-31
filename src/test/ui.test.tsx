import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { Sparkles } from 'lucide-react';

describe('UI Design System Components', () => {
  it('renders Button with variants and loading state', () => {
    const { rerender } = render(<Button variant="primary">Follow</Button>);
    expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();

    rerender(<Button isLoading={true}>Follow</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders Avatar with fallback placeholder when src is null', () => {
    const { container } = render(<Avatar src={null} alt="User" size="md" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders EmptyState with icon, title, description, and action button', () => {
    render(
      <EmptyState
        icon={Sparkles}
        title="No items found"
        description="Try searching for something else."
        actionLabel="Create Item"
        onAction={() => {}}
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try searching for something else.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });
});
