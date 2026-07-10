import { Flex, Text, IconButton, HStack } from '@chakra-ui/react';
import { Menu, Coins, Bell, Settings } from 'lucide-react';
import { useBalanceStore } from '../../stores/balanceStore';
import { useUiStore } from '../../stores/uiStore';
import { useEffect, useState } from 'react';

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (display === value) return;
    const diff = value - display;
    const step = Math.ceil(Math.abs(diff) / 10);
    const timer = setTimeout(() => {
      setDisplay((prev) => {
        if (Math.abs(value - prev) <= step) return value;
        return prev + (diff > 0 ? step : -step);
      });
    }, 16);
    return () => clearTimeout(timer);
  }, [value, display]);

  return <>{display.toLocaleString()}</>;
}

export function TopBar() {
  const balance = useBalanceStore((s) => s.balance);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      h="60px"
      bg="#161B22"
      borderBottom="1px solid #30363D"
      align="center"
      justify="space-between"
      px={4}
      zIndex={1000}
    >
      <HStack gap={3}>
        <IconButton
          aria-label="Menu"
          variant="ghost"
          size="sm"
          display={{ base: 'flex', md: 'none' }}
          onClick={toggleSidebar}
          color="#8B949E"
          _hover={{ color: '#F0F6FC' }}
        >
          <Menu size={20} />
        </IconButton>
        <Text
          fontSize="lg"
          fontWeight="800"
          letterSpacing="wider"
          color="#F0F6FC"
          fontFamily="heading"
        >
          DOPAMIX
        </Text>
      </HStack>

      <HStack gap={2}>
        <HStack
          gap={1.5}
          bg="#1C2128"
          px={3}
          py={1.5}
          borderRadius="md"
          border="1px solid #30363D"
        >
          <Coins size={16} color="#FFB800" />
          <Text fontSize="sm" fontWeight="600" color="#FFB800">
            <AnimatedCounter value={balance} />
          </Text>
        </HStack>
        <IconButton
          aria-label="Notifications"
          variant="ghost"
          size="sm"
          color="#8B949E"
          _hover={{ color: '#F0F6FC' }}
        >
          <Bell size={18} />
        </IconButton>
        <IconButton
          aria-label="Settings"
          variant="ghost"
          size="sm"
          color="#8B949E"
          _hover={{ color: '#F0F6FC' }}
        >
          <Settings size={18} />
        </IconButton>
      </HStack>
    </Flex>
  );
}
