import { Box, Flex, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, History, BarChart3, Gift } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/events', label: 'Events', icon: Trophy },
  { to: '/history', label: 'History', icon: History },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/rewards', label: 'Rewards', icon: Gift },
];

export function MobileNav() {
  return (
    <Flex
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      h="60px"
      bg="#161B22"
      borderTop="1px solid #30363D"
      display={{ base: 'flex', md: 'none' }}
      align="center"
      justify="space-around"
      zIndex={1000}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          style={{ textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={0.5}
              color={isActive ? '#00D395' : '#8B949E'}
            >
              <tab.icon size={20} />
              <Text fontSize="xs" fontWeight={isActive ? '600' : '400'}>
                {tab.label}
              </Text>
            </Box>
          )}
        </NavLink>
      ))}
    </Flex>
  );
}
