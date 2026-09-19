import { Suspense } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
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
        mb={{ base: 'calc(60px + env(safe-area-inset-bottom))', md: 0 }}
        overflow="auto"
      >
        <Box p={4}>
          <Suspense
            fallback={
              <Box minH="50vh" display="grid" placeItems="center" color="fg.subtle">
                <Spinner size="sm" />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
      </Box>
      <BetSlip />
      <MobileNav />
    </Flex>
  );
}
