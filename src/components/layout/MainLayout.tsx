import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { BetSlip } from '../../features/betting/components/BetSlip';

export function MainLayout() {
  return (
    <Flex minH="100vh" bg="#0D1117">
      <TopBar />
      <Sidebar />
      <Box
        as="main"
        flex={1}
        mt="60px"
        ml={{ base: 0, md: '240px' }}
        mr={{ base: 0, lg: '360px' }}
        mb={{ base: '60px', md: 0 }}
        overflow="auto"
      >
        <Box p={4}>
          <Outlet />
        </Box>
      </Box>
      <BetSlip />
      <MobileNav />
    </Flex>
  );
}
