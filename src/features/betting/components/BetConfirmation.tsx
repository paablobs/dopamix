import { Box, Text, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const MotionBox = motion.create(Box);

interface BetConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BetConfirmation({ isOpen, onClose }: BetConfirmationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          position="fixed"
          inset={0}
          bg="rgba(0,0,0,0.6)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={2000}
          onClick={onClose}
        >
          <MotionBox
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            bg="#161B22"
            borderRadius="xl"
            border="1px solid #00D395"
            p={8}
            textAlign="center"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack gap={4}>
              <MotionBox
                initial={{ rotate: -30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', damping: 12 }}
                color="#00D395"
              >
                <CheckCircle size={56} strokeWidth={1.5} />
              </MotionBox>
              <Text fontSize="xl" fontWeight="800" color="#F0F6FC">Bet Placed!</Text>
              <Text fontSize="sm" color="#8B949E">Your bet has been placed successfully</Text>
            </VStack>
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
