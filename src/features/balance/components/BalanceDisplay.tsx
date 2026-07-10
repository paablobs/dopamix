import { useEffect, useState, useRef } from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useBalanceStore } from '../../../stores/balanceStore';

const MotionHStack = motion.create(HStack);

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;

    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display.toLocaleString('en-US')}</>;
}

interface BalanceDisplayProps {
  size?: 'sm' | 'md' | 'lg';
}

export function BalanceDisplay({ size = 'md' }: BalanceDisplayProps) {
  const balance = useBalanceStore((s) => s.balance);
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
        <AnimatedCounter value={balance} />
      </Text>
    </MotionHStack>
  );
}
