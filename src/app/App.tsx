import { useEffect, useState, useCallback } from 'react';
import { Toaster, Toast, HStack, Box } from '@chakra-ui/react';
import { AppRouter } from './router';
import { useEventStore } from '../stores/eventStore';
import { useBetStore } from '../stores/betStore';
import { useRewardStore } from '../stores/rewardStore';
import { DailyRewardModal } from '../features/balance/components/DailyRewardModal';
import { toaster } from '../services/notificationService';

function useInterval(fn: () => void, ms: number) {
  useEffect(() => {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  }, [fn, ms]);
}

function shouldShowWelcome(): boolean {
  try {
    const raw = localStorage.getItem('dopamix_balance');
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return !parsed.state?.welcomeClaimed;
  } catch {
    return true;
  }
}

export default function App() {
  const generateEvents = useEventStore((s) => s.generateEvents);
  const refreshExpired = useEventStore((s) => s.refreshExpired);
  const tickEvents = useEventStore((s) => s.tickEvents);
  const tickBets = useBetStore((s) => s.tickBets);
  const updateStreak = useRewardStore((s) => s.updateStreak);
  const [showDailyReward, setShowDailyReward] = useState(shouldShowWelcome);

  useEffect(() => {
    generateEvents();
    updateStreak();
  }, [generateEvents, updateStreak]);

  const tickAndRefresh = useCallback(() => {
    tickBets();
    tickEvents();
    refreshExpired();
  }, [tickBets, tickEvents, refreshExpired]);

  useInterval(tickAndRefresh, 1000);

  return (
    <>
      <AppRouter />
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            bg="#161B22"
            border="1px solid #30363D"
            borderRadius="lg"
            color="#F0F6FC"
            px={4}
            py={3}
            boxShadow="lg"
            width="auto"
            minW="280px"
            maxW="380px"
          >
            <HStack gap={3} align="start" flex={1}>
              <Box
                w={2}
                h={2}
                borderRadius="full"
                mt={2}
                flexShrink={0}
                bg={
                  toast.type === 'success'
                    ? '#00D395'
                    : toast.type === 'error'
                      ? '#F85149'
                      : '#7C3AED'
                }
              />
              <Box flex={1}>
                <Toast.Title color="#F0F6FC" fontWeight="600" fontSize="sm" />
                <Toast.Description color="#8B949E" fontSize="xs" mt={0.5} />
              </Box>
            </HStack>
            <Toast.CloseTrigger color="#6E7681" _hover={{ color: '#F0F6FC' }} />
          </Toast.Root>
        )}
      </Toaster>
      <DailyRewardModal
        open={showDailyReward}
        onClose={() => setShowDailyReward(false)}
      />
    </>
  );
}
