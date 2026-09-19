import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Progress,
} from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useRewardStore } from '../stores/rewardStore';
import { useSettingsStore } from '../stores/settingsStore';
import { AVATARS, MYSTERY_BOX_INTERVAL, SPIN_SEGMENTS } from '../constants/rewards';

const MotionBox = motion.create(Box);
const MotionButton = motion.create(Button);

const WHEEL_COLORS = ['#FFB800', '#00D395', '#7C3AED', '#F85149', '#FFCD1A', '#00D395'];

function wheelPoint(angle: number, radius: number, center: number): [number, number] {
  const radians = (angle * Math.PI) / 180;
  return [center + radius * Math.sin(radians), center - radius * Math.cos(radians)];
}

function wheelSegmentPath(index: number, segmentAngle: number, radius: number, center: number): string {
  const start = wheelPoint(index * segmentAngle, radius, center);
  const end = wheelPoint((index + 1) * segmentAngle, radius, center);
  return `M ${center} ${center} L ${start[0]} ${start[1]} A ${radius} ${radius} 0 0 1 ${end[0]} ${end[1]} Z`;
}

function AchievementCard({ achievement }: { achievement: { name: string; description: string; icon: string; unlockedAt: number | null } }) {
  const isUnlocked = achievement.unlockedAt !== null;

  return (
    <Box
      bg="#161B22"
      border="1px solid"
      borderColor={isUnlocked ? '#00D395' : '#30363D'}
      borderRadius="lg"
      p={4}
      opacity={isUnlocked ? 1 : 0.6}
      transition="border-color 0.2s"
      _hover={{ borderColor: isUnlocked ? '#00D395' : '#484F58' }}
    >
      <HStack gap={3}>
        <Box
          fontSize="2xl"
          filter={isUnlocked ? 'none' : 'grayscale(100%)'}
        >
          {achievement.icon}
        </Box>
        <VStack align="start" gap={0}>
          <Text fontSize="sm" fontWeight="600" color="#F0F6FC">
            {achievement.name}
          </Text>
          <Text fontSize="xs" color="#6E7681">
            {achievement.description}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

function SpinWheel() {
  const spinWheel = useRewardStore((s) => s.spinWheel);
  const lastSpinClaim = useRewardStore((s) => s.lastSpinClaim);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ label: string; amount: number; multiplier?: number } | null>(null);
  const [rotation, setRotation] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const prefersReducedMotion = useReducedMotion();
  const motionAllowed = animationsEnabled && !prefersReducedMotion;

  useEffect(() => {
    const check = () => {
      setCanSpin(!lastSpinClaim || Date.now() - lastSpinClaim >= 86400000);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [lastSpinClaim]);

  const handleSpin = useCallback(() => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    setResult(null);

    const spinResult = spinWheel();
    if (!spinResult) {
      setSpinning(false);
      return;
    }

    const segmentIndex = SPIN_SEGMENTS.findIndex(
      (s) => s.label === spinResult.label
    );
    const segmentAngle = 360 / SPIN_SEGMENTS.length;
    const currentRotation = ((rotation % 360) + 360) % 360;
    const targetRotation = -((segmentIndex + 0.5) * segmentAngle);
    const targetAngle = motionAllowed
      ? 360 * 5 + targetRotation - currentRotation
      : targetRotation - currentRotation;

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setResult(spinResult);
      setSpinning(false);
    }, motionAllowed ? 3000 : 0);
  }, [canSpin, motionAllowed, rotation, spinning, spinWheel]);

  return (
    <VStack gap={4}>
      <Box position="relative" w="250px" h="250px">
        <Box
          position="absolute"
          top="-10px"
          left="50%"
          transform="translateX(-50%)"
          w={0}
          h={0}
          borderLeft="10px solid transparent"
          borderRight="10px solid transparent"
          borderTop="15px solid #FFB800"
          zIndex={2}
        />

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: motionAllowed ? 3 : 0, ease: 'easeOut' }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px solid #FFB800',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            role="img"
            aria-label="Lucky spin prize wheel"
            width="100%"
            height="100%"
          >
            <circle cx="50" cy="50" r="49" fill="#161B22" />
            {SPIN_SEGMENTS.map((segment, i) => {
              const segmentAngle = 360 / SPIN_SEGMENTS.length;
              const centerAngle = (i + 0.5) * segmentAngle;
              const [labelX, labelY] = wheelPoint(centerAngle, 29, 50);
              return (
                <g key={segment.label}>
                  <path
                    d={wheelSegmentPath(i, segmentAngle, 48, 50)}
                    fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                    stroke="#161B22"
                    strokeWidth="0.8"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    fill="#fff"
                    fontSize="7"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${centerAngle} ${labelX} ${labelY})`}
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
            <circle cx="50" cy="50" r="8" fill="#0D1117" stroke="#FFB800" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </Box>

      <MotionButton
        whileTap={motionAllowed ? { scale: 0.95 } : undefined}
        onClick={handleSpin}
        disabled={!canSpin || spinning}
        bg="#FFB800"
        color="white"
        fontWeight="700"
        size="lg"
        borderRadius="md"
        _hover={{ bg: '#cc9300' }}
        _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
      >
        {spinning ? 'Spinning...' : canSpin ? 'Spin' : 'Available tomorrow'}
      </MotionButton>

      {result && (
        <MotionBox
          initial={motionAllowed ? { opacity: 0, y: 10 } : false}
          animate={motionAllowed ? { opacity: 1, y: 0 } : undefined}
          bg="#21262D"
          border="1px solid"
          borderColor="#664a00"
          borderRadius="lg"
          p={4}
          textAlign="center"
          role="status"
          aria-live="polite"
        >
          {result.multiplier ? (
            <Text color="#FFB800" fontWeight="700" fontSize="lg">
              {result.multiplier}x Multiplier
            </Text>
          ) : (
            <Text color="#00D395" fontWeight="700" fontSize="lg">
              +{result.amount.toLocaleString('en-US')} credits
            </Text>
          )}
        </MotionBox>
      )}
    </VStack>
  );
}

function MysteryBox() {
  const openMysteryBox = useRewardStore((s) => s.openMysteryBox);
  const mysteryBoxCount = useRewardStore((s) => s.mysteryBoxCount);
  const [reward, setReward] = useState<{ type: string; amount: number } | null>(null);

  if (mysteryBoxCount < MYSTERY_BOX_INTERVAL && !reward) return null;

  const handleOpen = () => {
    const result = openMysteryBox();
    if (result) setReward(result);
  };

  return (
    <VStack
      gap={4}
      bg="#161B22"
      border="1px solid"
      borderColor="#7C3AED"
      borderRadius="lg"
      p={6}
    >
      <Box fontSize="4xl">🎁</Box>
      <Heading size="sm" color="#F0F6FC">
        Mystery Box
      </Heading>
      <Text fontSize="xs" color="#6E7681">
        You have a mystery box to open
      </Text>

      {reward ? (
        <VStack gap={1}>
          <Text color="#FFB800" fontWeight="700" fontSize="lg">
            {reward.type === 'credits'
              ? `+${reward.amount.toLocaleString('en-US')} credits`
              : `+${reward.amount} XP`}
          </Text>
        </VStack>
      ) : (
        <Button
          onClick={handleOpen}
          bg="#7C3AED"
          color="white"
          fontWeight="700"
          _hover={{ bg: '#6D28D9' }}
        >
          Open box
        </Button>
      )}
    </VStack>
  );
}

function AvatarSelector() {
  const profile = useRewardStore((s) => s.profile);
  const selectAvatar = useRewardStore((s) => s.selectAvatar);
  const unlocked = profile.progress.unlockedAvatars;
  const selected = profile.progress.selectedAvatar;

  return (
    <VStack gap={4} align="stretch">
      <Text fontSize="sm" fontWeight="600" color="#F0F6FC">
        Select avatar
      </Text>
      <SimpleGrid columns={{ base: 4, md: 6 }} gap={3}>
        {AVATARS.map((avatar) => {
          const isUnlocked = unlocked.includes(avatar.id);
          const isSelected = selected === avatar.id;

          return (
            <Button
              key={avatar.id}
              onClick={() => isUnlocked && selectAvatar(avatar.id)}
              type="button"
              disabled={!isUnlocked}
              aria-pressed={isSelected}
              aria-label={`${avatar.name}${isUnlocked ? (isSelected ? ', selected' : '') : `, unlocks at level ${avatar.unlockLevel}`}`}
              bg={isSelected ? 'rgba(0,211,149,0.15)' : '#161B22'}
              border="2px solid"
              borderColor={isSelected ? '#00D395' : '#30363D'}
              borderRadius="lg"
              p={3}
              h="auto"
              minH="96px"
              textAlign="center"
              opacity={isUnlocked ? 1 : 0.4}
              _hover={isUnlocked ? { borderColor: '#00D395' } : undefined}
              _disabled={{ cursor: 'not-allowed' }}
            >
              <VStack gap={1}>
                <Box fontSize="2xl" filter={!isUnlocked ? 'grayscale(100%)' : 'none'}>
                  {isUnlocked ? avatar.emoji : <Lock size={24} color="#6E7681" />}
                </Box>
                <Text fontSize="xs" color="#6E7681">
                  {avatar.name}
                </Text>
                {!isUnlocked && (
                  <Text fontSize="2xs" color="#6E7681">
                    Nv.{avatar.unlockLevel}
                  </Text>
                )}
              </VStack>
            </Button>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
}

export function RewardsPage() {
  const profile = useRewardStore((s) => s.profile);
  const achievements = useRewardStore((s) => s.achievements);
  const claimDailyReward = useRewardStore((s) => s.claimDailyReward);
  const lastDailyClaim = useRewardStore((s) => s.lastDailyClaim);
  const mysteryBoxCount = useRewardStore((s) => s.mysteryBoxCount);

  const progress = profile.progress;
  const xpPercent = Math.round((progress.xp / progress.xpToNext) * 100);

  const [canClaimDaily, setCanClaimDaily] = useState(true);

  useEffect(() => {
    const check = () => {
      setCanClaimDaily(!lastDailyClaim || Date.now() - lastDailyClaim >= 86400000);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [lastDailyClaim]);

  const handleClaimDaily = () => {
    claimDailyReward();
  };

  return (
    <VStack gap={8} align="stretch" w="full">
      <Heading size="lg" color="#F0F6FC">
        Rewards
      </Heading>

      <Box
        bg="#161B22"
        border="1px solid"
        borderColor="#30363D"
        borderRadius="lg"
        p={6}
      >
        <VStack gap={4} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" gap={0}>
              <Text fontSize="sm" color="#6E7681">
                Level {progress.level}
              </Text>
              <Text fontSize="xs" color="#6E7681">
                {progress.xp}/{progress.xpToNext} XP
              </Text>
            </VStack>
            <Text fontSize="xs" color="#6E7681">
              {xpPercent}%
            </Text>
          </HStack>
          <Progress.Root
            value={xpPercent}
            size="sm"
            colorPalette="green"
          >
            <Progress.Track borderRadius="full">
              <Progress.Range bg="#00D395" />
            </Progress.Track>
          </Progress.Root>
        </VStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <VStack gap={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontSize="md" fontWeight="600" color="#F0F6FC">
              Daily Reward
            </Text>
          </HStack>
          <Button
            onClick={handleClaimDaily}
            disabled={!canClaimDaily}
            bg="#FFB800"
            color="white"
            fontWeight="700"
            size="lg"
            _hover={{ bg: '#cc9300' }}
            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
          >
            {canClaimDaily ? 'Claim daily reward' : 'Available tomorrow'}
          </Button>
        </VStack>

        <VStack gap={4} align="stretch">
          <Text fontSize="md" fontWeight="600" color="#F0F6FC">
            Lucky Spin
          </Text>
          <SpinWheel />
        </VStack>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <MysteryBox />
        <Box
          bg="#161B22"
          border="1px solid"
          borderColor="#30363D"
          borderRadius="lg"
          p={4}
        >
          <Text fontSize="xs" color="#6E7681" textAlign="center">
            Bets for boxes: {mysteryBoxCount}/{MYSTERY_BOX_INTERVAL}
          </Text>
          <Progress.Root
            value={(mysteryBoxCount / MYSTERY_BOX_INTERVAL) * 100}
            size="xs"
            colorPalette="purple"
            mt={2}
          >
            <Progress.Track borderRadius="full">
              <Progress.Range bg="#7C3AED" />
            </Progress.Track>
          </Progress.Root>
        </Box>
      </SimpleGrid>

      <AvatarSelector />

      <VStack gap={4} align="stretch">
        <Text fontSize="md" fontWeight="600" color="#F0F6FC">
          Achievements ({achievements.filter((a) => a.unlockedAt !== null).length}/{achievements.length})
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}
