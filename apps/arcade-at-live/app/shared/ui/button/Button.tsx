'use client';

import type { VariantProps } from 'class-variance-authority';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '~/shared/utils';

const baseStyles
  = 'inline-flex items-center justify-center whitespace-nowrap outline-none ring-primary focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0';

export const buttonVariants = cva('gap-2 text-sm transition-all ease-out [&_svg]:size-4', {
  variants: {
    variant: {
      default: 'bg-primary text-black hover:bg-primary/80',
      outline: 'border border-line bg-bg hover:bg-bg-elevated hover:text-label',
      secondary: 'bg-bg-elevated text-label-neutral hover:bg-line hover:text-label',
      ghost: 'hover:bg-white/20',
    },
    rounded: {
      default: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    size: {
      default: 'h-9 px-4',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-10 px-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: 'default',
  },
});

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  icon?: boolean;
}

// Base button component
function BaseButton({ ref, icon, className, variantClassName, ...props }: ButtonProps & { variantClassName?: string } & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn('cursor-pointer disabled:cursor-not-allowed', variantClassName, icon && 'aspect-square p-0', className)}
      {...props}
    />
  );
}
BaseButton.displayName = 'BaseButton';

// Styled button component
export function Button({ ref, variant, size, rounded, className, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const variantClassName = cn(baseStyles, buttonVariants({ variant, size, rounded }));
  return <BaseButton ref={ref} variantClassName={variantClassName} className={className} {...props} />;
}
Button.displayName = 'Button';

// Unstyled button component
export function UnstyledButton({ ref, className, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  return <BaseButton ref={ref} className={className} {...props} />;
}
UnstyledButton.displayName = 'UnstyledButton';
