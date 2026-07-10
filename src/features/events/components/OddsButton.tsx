import { Button, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

interface OddsButtonProps {
  label: string;
  odds: number;
  potentialWin: number;
  isSelected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function OddsButton({ label, odds, potentialWin, isSelected, disabled, onClick }: OddsButtonProps) {
  return (
    <MotionButton
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      bg={isSelected ? '#00D395' : '#21262D'}
      color={isSelected ? 'white' : '#F0F6FC'}
      border="1px solid"
      borderColor={isSelected ? '#00D395' : '#30363D'}
      borderRadius="md"
      px={3}
      py={2}
      h="auto"
      flex={1}
      minW={0}
      _hover={{
        bg: isSelected ? '#00a876' : '#1C2128',
        borderColor: isSelected ? '#00a876' : '#8B949E',
      }}
      _disabled={{
        opacity: 0.4,
        cursor: 'not-allowed',
      }}
      transition={{ duration: 0.15 }}
    >
      <VStack gap={0}>
        <Text fontSize="xs" color={isSelected ? 'whiteAlpha.700' : '#8B949E'} fontWeight="500">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="700" color={isSelected ? 'white' : '#00D395'}>
          {odds.toFixed(2)}
        </Text>
        <Text fontSize="2xs" color={isSelected ? 'whiteAlpha.600' : '#6E7681'}>
          Win {potentialWin}
        </Text>
      </VStack>
    </MotionButton>
  );
}
