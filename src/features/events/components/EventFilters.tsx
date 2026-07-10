import { Tabs } from '@chakra-ui/react';
import type { EventCategory } from '../../../types';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '../../../constants/events';

interface EventFiltersProps {
  activeCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
}

export function EventFilters({ activeCategory, onCategoryChange }: EventFiltersProps) {
  return (
    <Tabs.Root
      value={activeCategory}
      onValueChange={(e) => onCategoryChange(e.value as EventCategory | 'all')}
      variant="line"
      colorPalette="green"
      size="sm"
    >
      <Tabs.List
        overflowX="auto"
        whiteSpace="nowrap"
        scrollbarWidth="none"
        css={{ '&::-webkit-scrollbar': { display: 'none' } }}
        gap={1}
      >
        <Tabs.Trigger value="all" fontWeight="600" textTransform="none">
          All
        </Tabs.Trigger>
        {CATEGORIES.map((cat) => (
          <Tabs.Trigger key={cat} value={cat} fontWeight="600" textTransform="none">
            {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
