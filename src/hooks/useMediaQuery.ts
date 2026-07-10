import { useBreakpointValue } from '@chakra-ui/react';

export function useIsMobile(): boolean {
  return useBreakpointValue({ base: true, md: false }) ?? true;
}

export function useIsDesktop(): boolean {
  return useBreakpointValue({ base: false, lg: true }) ?? false;
}
