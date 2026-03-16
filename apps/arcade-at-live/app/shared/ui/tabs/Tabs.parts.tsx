import type { TabItem } from './Tabs';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { UnstyledButton } from '~/shared/ui/button/Button';
import { cn } from '~/shared/utils';

export interface ScrollButtonProps {
  scrollHandler: () => void;
  direction: 'left' | 'right';
}

export interface TabItemButtonProps {
  item: TabItem;
  isActive: boolean;
  onSelect: (key: string | number) => void;
}

const SCROLL_BUTTON_CONFIG = {
  left: {
    Icon: CaretLeftIcon,
    className: 'left-0 bg-linear-to-r from-bg via-bg/80 to-transparent pl-2 pr-4',
  },
  right: {
    Icon: CaretRightIcon,
    className: 'right-0 bg-linear-to-l from-bg via-bg/80 to-transparent pl-4 pr-2',
  },
} as const;

export function ScrollButton({ scrollHandler, direction }: ScrollButtonProps) {
  const { Icon, className } = SCROLL_BUTTON_CONFIG[direction];

  return (
    <UnstyledButton
      onClick={scrollHandler}
      className={cn(
        'absolute top-0 z-10 flex h-full items-center text-label-assistive transition-colors hover:text-label text-2xl',
        className,
      )}
    >
      <Icon />
    </UnstyledButton>
  );
}

export function TabItemButton({ item, isActive, onSelect }: TabItemButtonProps) {
  return (
    <UnstyledButton
      onClick={() => onSelect(item.key)}
      className={cn(
        'relative -mb-px shrink-0 border-b-2 px-3.5 py-5 text-sm font-semibold uppercase tracking-tight transition-colors',
        isActive && 'border-primary text-primary',
        !isActive && 'border-transparent text-label-assistive hover:text-label',
      )}
    >
      {item.label}
      {item.badge != null && (
        <span className={cn(
          'ml-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded px-1 font-mono text-xs font-bold',
          isActive && 'bg-primary-dim text-primary',
          !isActive && 'bg-line text-label-assistive',
        )}
        >
          {item.badge}
        </span>
      )}
    </UnstyledButton>
  );
}
