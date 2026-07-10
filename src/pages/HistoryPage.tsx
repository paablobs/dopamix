import { useState, useMemo } from 'react';
import { Box, Heading, Text, Tabs, Badge, HStack, VStack, Button } from '@chakra-ui/react';
import { useBetStore } from '../stores/betStore';
import { useCountdown } from '../hooks/useCountdown';
import { formatCredits, formatOdds, formatProfit, formatDateTime, formatTimeRemaining } from '../utils/format';
import type { Bet } from '../types';

function ActiveBetRow({ bet }: { bet: Bet }) {
  const { remaining } = useCountdown(bet.resolutionDelay, bet.placedAt);

  return (
    <HStack
      justify="space-between"
      p={3}
      bg="#161B22"
      border="1px solid #30363D"
      borderRadius="md"
    >
      <VStack align="start" gap={0}>
        <Text fontSize="sm" color="#F0F6FC" fontWeight="500">
          {bet.eventSummary}
        </Text>
        <Text fontSize="xs" color="#6E7681">
          {bet.selection === 'home' ? 'Home' : bet.selection === 'draw' ? 'Draw' : 'Away'} @ {formatOdds(bet.odds)}
        </Text>
      </VStack>
      <VStack align="end" gap={0}>
        <Text fontSize="xs" color="#FFB800" fontWeight="600">
          {formatTimeRemaining(remaining)}
        </Text>
        <Text fontSize="xs" color="#6E7681">
          {formatCredits(bet.stake)} wagered
        </Text>
      </VStack>
    </HStack>
  );
}

function HistoryBetRow({ bet }: { bet: Bet }) {
  return (
    <HStack
      justify="space-between"
      p={3}
      bg="#161B22"
      border="1px solid #30363D"
      borderRadius="md"
    >
      <VStack align="start" gap={0}>
        <Text fontSize="sm" color="#F0F6FC" fontWeight="500">
          {bet.eventSummary}
        </Text>
        <Text fontSize="xs" color="#6E7681">
          {bet.selection === 'home' ? 'Home' : bet.selection === 'draw' ? 'Draw' : 'Away'} @ {formatOdds(bet.odds)}
        </Text>
        <Text fontSize="2xs" color="#6E7681">
          {formatDateTime(bet.placedAt)}
        </Text>
      </VStack>
      <VStack align="end" gap={1}>
        <Badge
          bg={bet.status === 'won' ? '#00D395' : '#F85149'}
          color="white"
          fontSize="xs"
          px={2}
          py={0.5}
          borderRadius="sm"
        >
          {bet.status === 'won' ? 'Won' : 'Lost'}
        </Badge>
        <Text
          fontSize="sm"
          fontWeight="600"
          color={bet.status === 'won' ? '#00D395' : '#F85149'}
        >
          {formatProfit(bet.profit)}
        </Text>
      </VStack>
    </HStack>
  );
}

export function HistoryPage() {
  const activeBets = useBetStore((s) => s.activeBets);
  const betHistory = useBetStore((s) => s.betHistory);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(20);

  const filtered = useMemo(() => {
    if (activeTab === 'active') return activeBets;
    if (activeTab === 'won') return betHistory.filter((b) => b.status === 'won');
    if (activeTab === 'lost') return betHistory.filter((b) => b.status === 'lost');
    return betHistory;
  }, [activeTab, activeBets, betHistory]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <VStack gap={6} align="stretch" w="full">
      <Heading size="lg" color="#F0F6FC">
        History
      </Heading>

      <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="active">Active ({activeBets.length})</Tabs.Trigger>
          <Tabs.Trigger value="won">Won</Tabs.Trigger>
          <Tabs.Trigger value="lost">Lost</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {activeTab === 'active' ? (
        activeBets.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text color="#6E7681" fontSize="sm">No active bets</Text>
          </Box>
        ) : (
          <VStack gap={2} align="stretch">
            {activeBets.map((bet) => <ActiveBetRow key={bet.id} bet={bet} />)}
          </VStack>
        )
      ) : (
        <>
          {visible.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text color="#6E7681" fontSize="sm">No bets in history</Text>
            </Box>
          ) : (
            <VStack gap={2} align="stretch">
              {visible.map((bet) => <HistoryBetRow key={bet.id} bet={bet} />)}
            </VStack>
          )}
          {visibleCount < filtered.length && (
            <Button
              onClick={() => setVisibleCount((c) => c + 20)}
              variant="outline"
              color="#8B949E"
              borderColor="#30363D"
              _hover={{ bg: '#161B22' }}
            >
              Load more
            </Button>
          )}
        </>
      )}
    </VStack>
  );
}
