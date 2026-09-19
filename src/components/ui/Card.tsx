import { Box, type BoxProps } from '@chakra-ui/react';

export function Card({ children, ...props }: BoxProps) {
  return (
    <Box
      bg="surface"
      border="1px solid"
      borderColor="border"
      borderRadius="lg"
      minW={0}
      {...props}
    >
      {children}
    </Box>
  );
}
