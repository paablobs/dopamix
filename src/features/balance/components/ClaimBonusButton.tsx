import { Button, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useBalanceStore } from '../../../stores/balanceStore';
import { WELCOME_BONUS, DAILY_BONUS, FREE_REFILL_AMOUNT } from '../../../constants/balance';

const MotionButton = motion.create(Button);

type BonusVariant = 'welcome' | 'daily' | 'refill';

interface ClaimBonusButtonProps {
  variant: BonusVariant;
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT_CONFIG: Record<BonusVariant, { label: string; amount: number; color: string }> = {
  welcome: { label: 'Welcome bonus', amount: WELCOME_BONUS, color: '#00D395' },
  daily: { label: 'Daily bonus', amount: DAILY_BONUS, color: '#FFB800' },
  refill: { label: 'Free refill', amount: FREE_REFILL_AMOUNT, color: '#7C3AED' },
};

export function ClaimBonusButton({ variant, size = 'md' }: ClaimBonusButtonProps) {
  const welcomeClaimed = useBalanceStore((s) => s.welcomeClaimed);
  const claimWelcomeBonus = useBalanceStore((s) => s.claimWelcomeBonus);
  const claimDailyBonus = useBalanceStore((s) => s.claimDailyBonus);
  const canClaimDaily = useBalanceStore((s) => s.canClaimDaily);
  const freeRefill = useBalanceStore((s) => s.freeRefill);
  const canFreeRefill = useBalanceStore((s) => s.canFreeRefill);

  const config = VARIANT_CONFIG[variant];

  const isDisabled =
    variant === 'welcome'
      ? welcomeClaimed
      : variant === 'daily'
        ? !canClaimDaily()
        : !canFreeRefill();

  const handleClaim = () => {
    if (variant === 'welcome') {
      claimWelcomeBonus();
    } else if (variant === 'daily') {
      claimDailyBonus();
    } else {
      freeRefill();
    }
  };

  return (
    <MotionButton
      whileTap={{ scale: 0.95 }}
      onClick={handleClaim}
      disabled={isDisabled}
      bg={config.color}
      color="white"
      borderRadius="md"
      fontWeight="600"
      _hover={{ opacity: 0.9 }}
      _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
      size={size}
    >
      <Gift size={16} />
      <Text>
        {isDisabled ? 'Claimed' : `${config.label} (+${config.amount.toLocaleString('en-US')})`}
      </Text>
    </MotionButton>
  );
}
