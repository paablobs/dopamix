import { useState, useMemo } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  IconButton,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Zap, AlertTriangle } from 'lucide-react';
import { useBetStore } from '../../../stores/betStore';
import { useBalanceStore } from '../../../stores/balanceStore';
import { useUiStore } from '../../../stores/uiStore';
import { MIN_STAKE } from '../../../constants/betting';
import { BetConfirmation } from './BetConfirmation';

const MotionBox = motion.create(Box);

const QUICK_STAKES = [50, 100, 250, 500] as const;

const SELECTION_LABELS: Record<string, string> = {
  home: 'Home',
  draw: 'Draw',
  away: 'Away',
};

export function BetSlip() {
  const betSlip = useBetStore((s) => s.betSlip);
  const removeFromBetSlip = useBetStore((s) => s.removeFromBetSlip);
  const clearBetSlip = useBetStore((s) => s.clearBetSlip);
  const placeBet = useBetStore((s) => s.placeBet);
  const balance = useBalanceStore((s) => s.balance);
  const welcomeClaimed = useBalanceStore((s) => s.welcomeClaimed);
  const claimWelcomeBonus = useBalanceStore((s) => s.claimWelcomeBonus);
  const canFreeRefill = useBalanceStore((s) => s.canFreeRefill);
  const freeRefill = useBalanceStore((s) => s.freeRefill);
  const betSlipOpen = useUiStore((s) => s.betSlipOpen);
  const closeBetSlip = useUiStore((s) => s.closeBetSlip);

  const [stake, setStake] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const stakeNum = useMemo(() => {
    const n = parseInt(stake, 10);
    return isNaN(n) ? 0 : n;
  }, [stake]);

  const isValidStake = stakeNum >= MIN_STAKE && stakeNum <= balance;
  const potentialWin = useMemo(() => {
    if (betSlip.length === 0 || stakeNum < MIN_STAKE) return 0;
    return Math.floor(stakeNum * betSlip[0].odds);
  }, [betSlip, stakeNum]);

  function handlePlaceBet() {
    if (!isValidStake || betSlip.length === 0) return;
    const success = placeBet(stakeNum);
    if (success) {
      setShowConfirmation(true);
      setStake('');
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  }

  function handleQuickStake(amount: number) {
    const clamped = Math.min(amount, balance);
    setStake(String(clamped));
  }

  function handleMaxStake() {
    setStake(String(balance));
  }

  return (
    <>
      <Portal>
        <Box
          position="fixed"
          inset={0}
          bg="rgba(0,0,0,0.5)"
          zIndex={1400}
          onClick={closeBetSlip}
          display={{ base: betSlipOpen ? 'block' : 'none', lg: 'none' }}
        />
      </Portal>

      <Portal>
        <MotionBox
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          position="fixed"
          top="60px"
          right={0}
          bottom={0}
          w={{ base: '100%', lg: '360px' }}
          bg="#0D1117"
          borderLeft="1px solid #30363D"
          zIndex={1500}
          display={{ base: betSlipOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection="column"
          overflow="hidden"
        >
          <HStack justify="space-between" align="center" px={4} py={3} borderBottom="1px solid #30363D">
            <HStack gap={2}>
              <Zap size={18} color="#FFB800" />
              <Text fontSize="md" fontWeight="700" color="#F0F6FC">Bet Slip</Text>
              {betSlip.length > 0 && (
                <Box bg="#00D395" color="white" fontSize="xs" fontWeight="700" px={2} py={0.5} borderRadius="full">
                  {betSlip.length}
                </Box>
              )}
            </HStack>
            <CloseButton size="sm" onClick={closeBetSlip} color="#8B949E" />
          </HStack>

          <Box flex={1} overflowY="auto" px={4} py={3}>
            {betSlip.length === 0 ? (
              <VStack gap={3} py={12} color="#8B949E">
                <Zap size={40} strokeWidth={1.5} />
                <Text fontSize="sm" textAlign="center">No selections in your bet slip</Text>
                <Text fontSize="xs" color="#6E7681" textAlign="center">Click on odds to add bets</Text>
              </VStack>
            ) : (
              <VStack gap={3} align="stretch">
                <AnimatePresence>
                  {betSlip.map((item) => (
                    <MotionBox
                      key={item.eventId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      bg="#21262D"
                      borderRadius="md"
                      border="1px solid #30363D"
                      p={3}
                    >
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="#8B949E" fontWeight="500">{item.eventSummary}</Text>
                        <IconButton
                          aria-label="Remove"
                          variant="ghost"
                          size="xs"
                          onClick={() => removeFromBetSlip(item.eventId)}
                          color="#6E7681"
                          _hover={{ color: '#F85149' }}
                        >
                          <X size={14} />
                        </IconButton>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="#F0F6FC" fontWeight="600">{SELECTION_LABELS[item.selection]}</Text>
                        <Text fontSize="sm" fontWeight="700" color="#00D395">{item.odds.toFixed(2)}</Text>
                      </HStack>
                    </MotionBox>
                  ))}
                </AnimatePresence>
              </VStack>
            )}
          </Box>

          {betSlip.length > 0 && (
            <Box px={4} py={3} borderTop="1px solid #30363D">
              <VStack gap={3} align="stretch">
                {balance < MIN_STAKE && (
                  <VStack gap={2} bg="rgba(248,81,73,0.1)" border="1px solid #F85149" borderRadius="md" p={3}>
                    <HStack gap={2}>
                      <AlertTriangle size={14} color="#F85149" />
                      <Text fontSize="xs" color="#F85149" fontWeight="600">Insufficient balance</Text>
                    </HStack>
                    {!welcomeClaimed ? (
                      <Button size="xs" bg="#00D395" color="white" fontWeight="600" onClick={claimWelcomeBonus} w="full">
                        Claim Welcome Bonus (+1,000)
                      </Button>
                    ) : canFreeRefill() ? (
                      <Button size="xs" bg="#7C3AED" color="white" fontWeight="600" onClick={freeRefill} w="full">
                        Free Refill (+250)
                      </Button>
                    ) : null}
                  </VStack>
                )}

                <HStack justify="space-between">
                  <Text fontSize="xs" color="#8B949E">Stake</Text>
                  <Button size="xs" variant="ghost" color="#6E7681" onClick={clearBetSlip} _hover={{ color: '#F85149' }}>
                    <Trash2 size={12} /> Clear
                  </Button>
                </HStack>

                <Input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  placeholder={`Min ${MIN_STAKE}`}
                  bg="#21262D"
                  border="1px solid #30363D"
                  color="#F0F6FC"
                  fontSize="sm"
                  _placeholder={{ color: '#6E7681' }}
                  _focus={{ borderColor: '#00D395' }}
                />

                <HStack gap={1.5}>
                  {QUICK_STAKES.map((amount) => (
                    <Button
                      key={amount}
                      size="xs"
                      flex={1}
                      bg="#1C2128"
                      color="#8B949E"
                      border="1px solid #30363D"
                      fontWeight="600"
                      fontSize="xs"
                      _hover={{ bg: '#21262D', color: '#F0F6FC' }}
                      onClick={() => handleQuickStake(amount)}
                    >
                      {amount}
                    </Button>
                  ))}
                  <Button
                    size="xs"
                    flex={1}
                    bg="#1C2128"
                    color="#FFB800"
                    border="1px solid #664a00"
                    fontWeight="600"
                    fontSize="xs"
                    _hover={{ bg: '#332500' }}
                    onClick={handleMaxStake}
                  >
                    Max
                  </Button>
                </HStack>

                {stakeNum >= MIN_STAKE && (
                  <HStack justify="space-between" py={1}>
                    <Text fontSize="sm" color="#8B949E">Potential win</Text>
                    <Text fontSize="sm" fontWeight="700" color="#00D395">{potentialWin.toLocaleString()}</Text>
                  </HStack>
                )}

                <Button
                  w="full"
                  bg="#00D395"
                  color="white"
                  fontWeight="700"
                  fontSize="sm"
                  disabled={!isValidStake}
                  _hover={{ bg: '#00a876' }}
                  _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                  onClick={handlePlaceBet}
                >
                  <HStack gap={2}>
                    <Zap size={16} />
                    <Text>
                      {!isValidStake && stakeNum > 0 && stakeNum > balance
                        ? 'Insufficient balance'
                        : `Place Bet ${stakeNum >= MIN_STAKE ? stakeNum.toLocaleString() : ''}`}
                    </Text>
                  </HStack>
                </Button>
              </VStack>
            </Box>
          )}
        </MotionBox>
      </Portal>

      <BetConfirmation isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} />
    </>
  );
}
