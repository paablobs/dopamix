import { Flex, Text, IconButton, HStack } from '@chakra-ui/react';
import { Menu, Coins, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBalanceStore } from '../../stores/balanceStore';
import { useUiStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { formatCurrency } from '../../utils/format';

export function TopBar() {
  const balance = useBalanceStore((s) => s.balance);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const currencyFormat = useSettingsStore((s) => s.currencyFormat);

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
            {formatCurrency(balance, currencyFormat)}
          </Text>
        </HStack>
        <IconButton
          aria-label="Settings"
          variant="ghost"
          size="sm"
          color="#8B949E"
          _hover={{ color: '#F0F6FC' }}
          onClick={() => navigate('/settings')}
        >
          <Settings size={18} />
        </IconButton>
      </HStack>
    </Flex>
  );
}
