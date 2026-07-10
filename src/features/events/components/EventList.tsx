import { useState, useEffect, useMemo } from 'react';
import { Box, SimpleGrid, Input, Text, VStack, HStack } from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EventCategory } from '../../../types';
import { useEventStore } from '../../../stores/eventStore';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';

const MotionBox = motion.create(Box);

export function EventList() {
  const events = useEventStore((s) => s.events);
  const generateEvents = useEventStore((s) => s.generateEvents);

  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    generateEvents();
  }, [generateEvents]);

  const filtered = useMemo(() => {
    let result = events;
    if (activeCategory !== 'all') {
      result = result.filter((e) => e.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.homeTeam.toLowerCase().includes(q) ||
          e.awayTeam.toLowerCase().includes(q) ||
          e.league.toLowerCase().includes(q)
      );
    }
    return result;
  }, [events, activeCategory, search]);

  return (
    <VStack gap={4} align="stretch" w="full">
      <EventFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <HStack
        bg="#161B22"
        border="1px solid #30363D"
        borderRadius="md"
        px={3}
        py={2}
        gap={2}
      >
        <Search size={16} color="#6E7681" />
        <Input
          placeholder="Search team or league..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="transparent"
          border="none"
          color="#F0F6FC"
          p={0}
          _placeholder={{ color: '#6E7681' }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
        />
      </HStack>

      {filtered.length === 0 ? (
        <Box textAlign="center" py={12}>
          <Text color="#6E7681" fontSize="sm">
            No events available
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <MotionBox
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <EventCard event={event} />
              </MotionBox>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      )}
    </VStack>
  );
}
