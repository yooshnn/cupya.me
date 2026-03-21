import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cn } from '~/lib/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-xl',
    'font-medium transition-all select-none',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-pri-text font-bold',
          'hover:brightness-110 active:brightness-95',
        ],
        secondary: [
          'border border-line text-label-n bg-transparent',
          'hover:bg-surface active:bg-surface/70',
        ],
        ghost: [
          'text-label-a bg-transparent',
          'hover:text-label hover:bg-surface',
        ],
        danger: [
          'text-danger bg-transparent',
          'hover:opacity-80',
        ],
      },
      size: {
        default: 'px-4 py-3 text-[13px]',
        sm: 'px-3 py-2 text-[12px]',
        icon: 'w-8 h-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
