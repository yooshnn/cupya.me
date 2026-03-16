import { useScrollable } from './Tabs.hooks';
import { ScrollButton, TabItemButton } from './Tabs.parts';

export interface TabItem {
  key: string | number;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string | number | null;
  onSelect: (key: string | number) => void;
}

export function Tabs({ items, activeKey, onSelect }: TabsProps) {
  const { scrollRef, canScrollLeft, canScrollRight, handleScrollLeft, handleScrollRight } = useScrollable();

  return (
    <div className="relative border-b border-line">
      {canScrollLeft && (
        <ScrollButton scrollHandler={handleScrollLeft} direction="left" />
      )}

      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto overflow-y-hidden px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(item => (
          <TabItemButton
            key={item.key}
            item={item}
            isActive={activeKey === item.key}
            onSelect={onSelect}
          />
        ))}
      </div>

      {canScrollRight && (
        <ScrollButton scrollHandler={handleScrollRight} direction="right" />
      )}
    </div>
  );
}
