import { useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  Portal,
  Button,
  Text,
  VStack,
  HStack,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useBalanceStore } from '../../../stores/balanceStore';
import { WELCOME_BONUS } from '../../../constants/balance';

const MotionBox = motion.create(Box);

function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#FFB800', '#00D395', '#7C3AED', '#F85149', '#FFCD1A'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.offsetWidth / 2,
        y: canvas.offsetHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 2,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
      });
    }

    let frame = 0;
    const maxFrames = 90;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.3;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        const opacity = Math.max(0, 1 - frame / maxFrames);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(draw);
      }
    };

    requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animate();
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

interface DailyRewardModalProps {
  open: boolean;
  onClose: () => void;
}

export function DailyRewardModal({ open, onClose }: DailyRewardModalProps) {
  const welcomeClaimed = useBalanceStore((s) => s.welcomeClaimed);
  const claimWelcomeBonus = useBalanceStore((s) => s.claimWelcomeBonus);

  const handleClaim = () => {
    claimWelcomeBonus();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="#161B22"
            border="1px solid #30363D"
            borderRadius="xl"
            p={0}
            maxW="400px"
            w="full"
            position="relative"
            overflow="hidden"
          >
            <MotionBox
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              p={8}
              position="relative"
            >
              {!welcomeClaimed && <ConfettiEffect />}

              <VStack gap={6} position="relative" zIndex={1}>
                <motion.div
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <HStack
                    justify="center"
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    bg="#FFB800"
                    color="white"
                  >
                    <Gift size={32} />
                  </HStack>
                </motion.div>

                <Dialog.Title asChild>
                  <Text fontSize="xl" fontWeight="800" color="#F0F6FC" textAlign="center">
                    Welcome to DopamiX!
                  </Text>
                </Dialog.Title>

                <Text fontSize="sm" color="#8B949E" textAlign="center">
                  Claim your welcome bonus and start betting
                </Text>

                <HStack
                  gap={2}
                  bg="#1C2128"
                  px={4}
                  py={3}
                  borderRadius="lg"
                  border="1px solid #30363D"
                >
                  <Text fontSize="2xl" fontWeight="800" color="#FFB800">
                    +{WELCOME_BONUS.toLocaleString('en-US')}
                  </Text>
                  <Text fontSize="sm" color="#8B949E">
                    credits
                  </Text>
                </HStack>

                <Button
                  onClick={handleClaim}
                  bg="#00D395"
                  color="white"
                  fontWeight="700"
                  borderRadius="md"
                  w="full"
                  _hover={{ bg: '#00a876' }}
                  size="lg"
                >
                  Claim
                </Button>
              </VStack>
            </MotionBox>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
