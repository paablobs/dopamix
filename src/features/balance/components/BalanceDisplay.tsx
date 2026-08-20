import { useEffect, useState, useRef } from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useBalanceStore } from '../../../stores/balanceStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { formatCurrency } from '../../../utils/format';

const MotionHStack = motion.create(HStack);

interface BalanceDisplayProps {
  size?: 'sm' | 'md' | 'lg';
}

export function BalanceDisplay({ size = 'md' }: BalanceDisplayProps) {
  const balance = useBalanceStore((s) => s.balance);
  const currencyFormat = useSettingsStore((s) => s.currencyFormat);
  const [pulse, setPulse] = useState(false);
  const prevBalance = useRef(balance);

  useEffect(() => {
    if (balance !== prevBalance.current) {
      setPulse(true);
      prevBalance.current = balance;
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [balance]);

  const iconSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 16;
  const textSize = size === 'lg' ? 'md' : size === 'sm' ? 'xs' : 'sm';

  return (
    <MotionHStack
      gap={1.5}
      bg="#1C2128"
      px={3}
      py={1.5}
      borderRadius="md"
      border="1px solid #30363D"
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Coins size={iconSize} color="#FFB800" />
      <Text fontSize={textSize} fontWeight="600" color="#FFB800" fontVariantNumeric="tabular-nums">
        {formatCurrency(balance, currencyFormat)}
      </Text>
    </MotionHStack>
  );
}
