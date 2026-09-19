import { useEffect, useRef } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, History, BarChart3, Gift, Settings } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/events', label: 'Events', icon: Trophy },
  { to: '/history', label: 'History', icon: History },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const sidebarRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 47.9975rem)').matches;

    if (sidebarOpen && isMobile) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      sidebarRef.current?.focus();
    }

    if (!sidebarOpen && wasOpenRef.current && isMobile) {
      returnFocusRef.current?.focus();
    }

    wasOpenRef.current = sidebarOpen;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }

      if (event.key !== 'Tab' || !sidebarOpen || !isMobile || !sidebarRef.current) return;

      const focusable = Array.from(
        sidebarRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) {
        event.preventDefault();
        sidebarRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, closeSidebar]);

  return (
    <>
      <Box
        position="fixed"
        top="60px"
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.55)"
        display={{ base: sidebarOpen ? 'block' : 'none', md: 'none' }}
        zIndex={800}
        aria-hidden="true"
        onClick={closeSidebar}
      />
      <Box
        ref={sidebarRef}
        id="main-sidebar"
        as="nav"
        aria-label="Main navigation"
        tabIndex={-1}
        position="fixed"
        top="60px"
        left={0}
        bottom={0}
        w="240px"
        maxW="calc(100vw - 32px)"
        bg="#0D1117"
        borderRight="1px solid #21262D"
        display={{ base: sidebarOpen ? 'flex' : 'none', md: 'flex' }}
        flexDirection="column"
        pt={4}
        zIndex={900}
        _focus={{ outline: 'none' }}
      >
        <VStack gap={0.5} align="stretch" px={2}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeSidebar}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={3}
                  py={2.5}
                  minH="44px"
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
                  _focusVisible={{
                    outline: '2px solid #00D395',
                    outlineOffset: '-2px',
                  }}
                >
                  <link.icon size={18} aria-hidden="true" />
                  <Text>{link.label}</Text>
                </Box>
              )}
            </NavLink>
          ))}
        </VStack>
      </Box>
    </>
  );
}
