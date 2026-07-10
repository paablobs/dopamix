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
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useRewardStore } from '../stores/rewardStore';
import { AVATARS, SPIN_SEGMENTS } from '../constants/rewards';

const MotionBox = motion.create(Box);
const MotionButton = motion.create(Button);

const WHEEL_COLORS = ['#FFB800', '#00D395', '#7C3AED', '#F85149', '#FFCD1A', '#00D395'];

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
    const targetAngle =
      360 * 5 + segmentIndex * segmentAngle + segmentAngle / 2;

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setResult(spinResult);
      setSpinning(false);
    }, 3000);
  }, [canSpin, spinning, spinWheel]);

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
          transition={{ duration: 3, ease: 'easeOut' }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px solid #FFB800',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {SPIN_SEGMENTS.map((segment, i) => {
            const angle = (360 / SPIN_SEGMENTS.length) * i;
            return (
              <div
                key={segment.label}
                style={{
                  position: 'absolute',
                  width: '50%',
                  height: '50%',
                  transformOrigin: '100% 100%',
                  transform: `rotate(${angle}deg)`,
                  background: WHEEL_COLORS[i % WHEEL_COLORS.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '25%',
                    left: '25%',
                    transform: 'rotate(45deg)',
                    fontWeight: 700,
                    fontSize: '11px',
                    color: '#fff',
                  }}
                >
                  {segment.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </Box>

      <MotionButton
        whileTap={{ scale: 0.95 }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          bg="#21262D"
          border="1px solid"
          borderColor="#664a00"
          borderRadius="lg"
          p={4}
          textAlign="center"
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

  if (mysteryBoxCount < 5) return null;

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
            <Box
              key={avatar.id}
              onClick={() => isUnlocked && selectAvatar(avatar.id)}
              bg={isSelected ? 'rgba(0,211,149,0.15)' : '#161B22'}
              border="2px solid"
              borderColor={isSelected ? '#00D395' : '#30363D'}
              borderRadius="lg"
              p={3}
              textAlign="center"
              cursor={isUnlocked ? 'pointer' : 'not-allowed'}
              opacity={isUnlocked ? 1 : 0.4}
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
            </Box>
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
            Bets for boxes: {mysteryBoxCount}/5
          </Text>
          <Progress.Root
            value={(mysteryBoxCount / 5) * 100}
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
