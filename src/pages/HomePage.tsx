import { Box, Heading, Text, SimpleGrid, HStack, Button, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Trophy, Target, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useBalanceStore } from '../stores/balanceStore';
import { useBetStore } from '../stores/betStore';
import { useRewardStore } from '../stores/rewardStore';
import { useEventStore } from '../stores/eventStore';
import { EventCard } from '../features/events/components/EventCard';
import { ClaimBonusButton } from '../features/balance/components/ClaimBonusButton';

const MotionBox = motion.create(Box);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <MotionBox
      variants={item}
      bg="#161B22"
      border="1px solid #30363D"
      borderRadius="lg"
      p={4}
    >
      <HStack gap={3}>
        <Box color={color}>{icon}</Box>
        <VStack align="start" gap={0}>
          <Text fontSize="xs" color="#6E7681">{label}</Text>
          <Text fontSize="lg" fontWeight="700" color="#F0F6FC">{value}</Text>
        </VStack>
      </HStack>
    </MotionBox>
  );
}

export function HomePage() {
  const balance = useBalanceStore((s) => s.balance);
  const activeBets = useBetStore((s) => s.activeBets);
  const events = useEventStore((s) => s.events);
  const progress = useRewardStore((s) => s.profile.progress);

  const totalBets = progress.totalBetsPlaced;
  const winRate = totalBets > 0 ? Math.round((progress.totalBetsWon / totalBets) * 100) : 0;
  const featuredEvents = events.slice(0, 6);

  return (
    <VStack gap={8} align="stretch" w="full">
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="#161B22"
        border="1px solid #30363D"
        borderRadius="xl"
        p={8}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(135deg, rgba(0,211,149,0.15), rgba(124,58,237,0.08))"
        />
        <VStack align="start" gap={3} position="relative" zIndex={1}>
          <Heading size="2xl" color="#F0F6FC" fontWeight="800">
            Welcome to DopamiX
          </Heading>
          <Text color="#8B949E" fontSize="md">
            Bet in style, win with excitement
          </Text>
          <HStack gap={3} mt={2}>
            <ClaimBonusButton variant="welcome" />
            <ClaimBonusButton variant="daily" />
          </HStack>
        </VStack>
      </MotionBox>

      <MotionBox variants={container} initial="hidden" animate="show">
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <StatCard icon={<Wallet size={24} />} label="Balance" value={balance.toLocaleString('en-US')} color="#00D395" />
          <StatCard icon={<Target size={24} />} label="Active bets" value={activeBets.length} color="#FFB800" />
          <StatCard icon={<Trophy size={24} />} label="Total bets" value={totalBets} color="#7C3AED" />
          <StatCard icon={<TrendingUp size={24} />} label="Win rate" value={`${winRate}%`} color="#00D395" />
        </SimpleGrid>
      </MotionBox>

      <VStack align="stretch" gap={4}>
        <HStack justify="space-between" align="center">
          <Heading size="md" color="#F0F6FC">Featured Events</Heading>
          <Button asChild variant="ghost" color="#00D395" size="sm">
            <RouterLink to="/events">
              View all <ArrowRight size={14} />
            </RouterLink>
          </Button>
        </HStack>

        {featuredEvents.length === 0 ? (
          <Box textAlign="center" py={12} color="#6E7681">
            <Text>No events available</Text>
          </Box>
        ) : (
          <MotionBox variants={container} initial="hidden" animate="show">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {featuredEvents.map((event) => (
                <MotionBox key={event.id} variants={item}>
                  <EventCard event={event} />
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        )}
      </VStack>
    </VStack>
  );
}
