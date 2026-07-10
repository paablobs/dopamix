import { useMemo } from 'react';
import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Wallet,
  Target,
  Trophy,
  TrendingUp,
  TrendingDown,
  Flame,
  Zap,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useBalanceStore } from '../stores/balanceStore';
import { useBetStore } from '../stores/betStore';
import { useRewardStore } from '../stores/rewardStore';
import type { Bet } from '../types';

const COLORS = {
  win: '#00D395',
  loss: '#F85149',
  active: '#FFB800',
  accent: '#7C3AED',
};

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Box bg="#161B22" border="1px solid #30363D" borderRadius="lg" p={4}>
      <VStack align="start" gap={2}>
        <Box color={color}>{icon}</Box>
        <Text fontSize="xs" color="#6E7681">{label}</Text>
        <Text fontSize="xl" fontWeight="700" color="#F0F6FC">{value}</Text>
      </VStack>
    </Box>
  );
}

function getBalanceData(betHistory: Bet[]) {
  const days = 14;
  const now = new Date();
  const data: { date: string; balance: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(now, i);
    const dayStr = format(day, 'dd/MM');
    const dayTimestamp = day.getTime();
    let runningBalance = 0;
    for (const bet of betHistory) {
      if (bet.resolvedAt && bet.resolvedAt <= dayTimestamp + 86400000) {
        runningBalance += bet.profit ?? 0;
      }
    }
    data.push({ date: dayStr, balance: runningBalance });
  }
  return data;
}

function getWinLossData(betHistory: Bet[]) {
  const won = betHistory.filter((b) => b.status === 'won').length;
  const lost = betHistory.filter((b) => b.status === 'lost').length;
  return [
    { name: 'Won', value: won || 0 },
    { name: 'Lost', value: lost || 0 },
  ];
}

function getDailyActivity(betHistory: Bet[]) {
  const days = 7;
  const now = new Date();
  const data: { date: string; bets: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(now, i);
    const dayStr = format(day, 'EEE');
    const dayStart = day.setHours(0, 0, 0, 0);
    const dayEnd = dayStart + 86400000;
    const count = betHistory.filter(
      (b) => b.placedAt >= dayStart && b.placedAt < dayEnd
    ).length;
    data.push({ date: dayStr, bets: count });
  }
  return data;
}

export function DashboardPage() {
  const balance = useBalanceStore((s) => s.balance);
  const betHistory = useBetStore((s) => s.betHistory);
  const progress = useRewardStore((s) => s.profile.progress);

  const stats = useMemo(() => {
    const total = progress.totalBetsPlaced;
    const won = progress.totalBetsWon;
    const lost = progress.totalBetsLost;
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
    let totalWon = 0;
    let totalLost = 0;
    let bestStreak = 0;
    let currentStreak = 0;
    let biggestWin = 0;
    for (const bet of betHistory) {
      if (bet.profit !== null) {
        if (bet.profit >= 0) {
          totalWon += bet.profit;
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
          biggestWin = Math.max(biggestWin, bet.profit);
        } else {
          totalLost += Math.abs(bet.profit);
          currentStreak = 0;
        }
      }
    }
    return { total, won, lost, winRate, totalWon, totalLost, bestStreak, biggestWin };
  }, [betHistory, progress]);

  const balanceData = useMemo(() => getBalanceData(betHistory), [betHistory]);
  const winLossData = useMemo(() => getWinLossData(betHistory), [betHistory]);
  const dailyData = useMemo(() => getDailyActivity(betHistory), [betHistory]);
  const recentBets = betHistory.slice(0, 5);

  const tooltipStyle = {
    backgroundColor: '#161B22',
    border: '1px solid #30363D',
    borderRadius: 8,
    color: '#F0F6FC',
  };

  return (
    <VStack gap={8} align="stretch" w="full">
      <Heading size="lg" color="#F0F6FC">Dashboard</Heading>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4}>
        <StatCard icon={<Wallet size={22} />} label="Balance" value={balance.toLocaleString('en-US')} color="#00D395" />
        <StatCard icon={<Target size={22} />} label="Total bets" value={stats.total} color="#7C3AED" />
        <StatCard icon={<Trophy size={22} />} label="Win rate" value={`${stats.winRate}%`} color="#00D395" />
        <StatCard icon={<TrendingUp size={22} />} label="Total won" value={`+${stats.totalWon.toLocaleString('en-US')}`} color="#00D395" />
        <StatCard icon={<TrendingDown size={22} />} label="Total lost" value={`-${stats.totalLost.toLocaleString('en-US')}`} color="#F85149" />
        <StatCard icon={<Flame size={22} />} label="Best streak" value={stats.bestStreak} color="#FFB800" />
        <StatCard icon={<Zap size={22} />} label="Biggest win" value={stats.biggestWin.toLocaleString('en-US')} color="#FFB800" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Box bg="#161B22" border="1px solid #30363D" borderRadius="lg" p={4}>
          <Text fontSize="sm" fontWeight="600" color="#F0F6FC" mb={4}>Accumulated balance</Text>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="date" tick={{ fill: '#8B949E', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="balance" stroke={COLORS.win} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box bg="#161B22" border="1px solid #30363D" borderRadius="lg" p={4}>
          <Text fontSize="sm" fontWeight="600" color="#F0F6FC" mb={4}>Win/Loss ratio</Text>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={winLossData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                <Cell fill={COLORS.win} />
                <Cell fill={COLORS.loss} />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <HStack justify="center" gap={4} mt={2}>
            <HStack gap={1}>
              <Box w={3} h={3} borderRadius="sm" bg={COLORS.win} />
              <Text fontSize="xs" color="#6E7681">Won ({winLossData[0]?.value})</Text>
            </HStack>
            <HStack gap={1}>
              <Box w={3} h={3} borderRadius="sm" bg={COLORS.loss} />
              <Text fontSize="xs" color="#6E7681">Lost ({winLossData[1]?.value})</Text>
            </HStack>
          </HStack>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Box bg="#161B22" border="1px solid #30363D" borderRadius="lg" p={4}>
          <Text fontSize="sm" fontWeight="600" color="#F0F6FC" mb={4}>Daily activity</Text>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="date" tick={{ fill: '#8B949E', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="bets" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box bg="#161B22" border="1px solid #30363D" borderRadius="lg" p={4}>
          <Text fontSize="sm" fontWeight="600" color="#F0F6FC" mb={4}>Recent bets</Text>
          {recentBets.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="#6E7681" fontSize="sm">No recent bets</Text>
            </Box>
          ) : (
            <VStack align="stretch" gap={3}>
              {recentBets.map((bet) => (
                <HStack key={bet.id} justify="space-between" p={3} bg="#21262D" borderRadius="md">
                  <VStack align="start" gap={0}>
                    <Text fontSize="sm" color="#F0F6FC" fontWeight="500">{bet.eventSummary}</Text>
                    <Text fontSize="xs" color="#6E7681">
                      {bet.selection === 'home' ? 'Home' : bet.selection === 'draw' ? 'Draw' : 'Away'} @ {bet.odds.toFixed(2)}
                    </Text>
                  </VStack>
                  <Text fontSize="sm" fontWeight="600" color={bet.status === 'won' ? '#00D395' : bet.status === 'lost' ? '#F85149' : '#FFB800'}>
                    {bet.status === 'active' ? 'Active' : bet.profit !== null ? `${bet.profit >= 0 ? '+' : ''}${bet.profit.toLocaleString('en-US')}` : '-'}
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>
      </SimpleGrid>
    </VStack>
  );
}
