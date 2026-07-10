import { Box, VStack, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, History, BarChart3, Gift, Settings } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/events', label: 'Events', icon: Trophy },
  { to: '/history', label: 'History', icon: History },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <Box
      position="fixed"
      top="60px"
      left={0}
      bottom={0}
      w="240px"
      bg="#0D1117"
      borderRight="1px solid #21262D"
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
      pt={4}
      zIndex={900}
    >
      <VStack gap={0.5} align="stretch" px={2}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <Box
                display="flex"
                alignItems="center"
                gap={3}
                px={3}
                py={2.5}
                borderRadius="md"
                bg={isActive ? '#161B22' : 'transparent'}
                color={isActive ? '#F0F6FC' : '#8B949E'}
                fontWeight={isActive ? '600' : '400'}
                fontSize="sm"
                transition="all 0.15s"
                _hover={{
                  bg: '#161B22',
                  color: '#F0F6FC',
                }}
              >
                <link.icon size={18} />
                <Text>{link.label}</Text>
              </Box>
            )}
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
}
