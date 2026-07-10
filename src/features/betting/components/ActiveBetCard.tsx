import { useMemo } from 'react';
import { Box, Text, VStack, HStack, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { useCountdown } from '../../../hooks/useCountdown';
import type { Bet } from '../../../types';

const MotionBox = motion.create(Box);

const SELECTION_LABELS: Record<string, string> = {
  home: 'Home',
  draw: 'Draw',
  away: 'Away',
};

interface ActiveBetCardProps {
  bet: Bet;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ActiveBetCard({ bet }: ActiveBetCardProps) {
  const { remaining, isDone } = useCountdown(bet.resolutionDelay, bet.placedAt);

  const progress = useMemo(() => {
    if (bet.resolutionDelay === 0) return 0;
    return Math.max(0, (remaining / bet.resolutionDelay) * 100);
  }, [remaining, bet.resolutionDelay]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg="#161B22"
      border="1px solid #30363D"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box p={4}>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="xs" color="#8B949E" fontWeight="500">{bet.eventSummary}</Text>
          <HStack gap={1} color="#FFB800">
            <Clock size={12} />
            <Text fontSize="xs" fontWeight="600" fontVariantNumeric="tabular-nums">
              {isDone ? 'Resolving...' : formatTime(remaining)}
            </Text>
          </HStack>
        </HStack>

        <HStack justify="space-between" mb={3}>
          <HStack gap={2}>
            <Zap size={14} color="#00D395" />
            <Text fontSize="sm" fontWeight="600" color="#F0F6FC">{SELECTION_LABELS[bet.selection]}</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="700" color="#00D395">{bet.odds.toFixed(2)}</Text>
        </HStack>

        <HStack justify="space-between" mb={3}>
          <VStack gap={0} align="flex-start">
            <Text fontSize="2xs" color="#6E7681">Stake</Text>
            <Text fontSize="sm" fontWeight="600" color="#F0F6FC">{bet.stake.toLocaleString()}</Text>
          </VStack>
          <VStack gap={0} align="flex-end">
            <Text fontSize="2xs" color="#6E7681">Potential win</Text>
            <Text fontSize="sm" fontWeight="700" color="#00D395">{bet.potentialWin.toLocaleString()}</Text>
          </VStack>
        </HStack>

        <Progress.Root value={isDone ? 0 : progress} size="sm" colorPalette="green" borderRadius="full">
          <Progress.Track bg="#21262D">
            <Progress.Range bg={isDone ? '#FFB800' : '#00D395'} transition="width 1s linear" />
          </Progress.Track>
        </Progress.Root>
      </Box>
    </MotionBox>
  );
}
