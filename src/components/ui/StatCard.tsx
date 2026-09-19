import { Box, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card p={4}>
      <VStack align="start" gap={2}>
        <Box color={color}>{icon}</Box>
        <Text fontSize="xs" color="fg.subtle">{label}</Text>
        <Text fontSize="xl" fontWeight="700" color="fg">{value}</Text>
      </VStack>
    </Card>
  );
}
