import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Switch,
  Select,
  createListCollection,
  Button,
  VStack,
  HStack,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { Volume2, VolumeX, Sparkles, Coins, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

const currencyCollection = createListCollection({
  items: [
    { label: 'Credits', value: 'credits' },
    { label: 'Coins', value: 'coins' },
    { label: 'Gems', value: 'gems' },
  ],
});

export function SettingsPage() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const currencyFormat = useSettingsStore((s) => s.currencyFormat);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const toggleAnimations = useSettingsStore((s) => s.toggleAnimations);
  const setCurrencyFormat = useSettingsStore((s) => s.setCurrencyFormat);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <VStack gap={8} align="stretch" w="full" maxW="600px">
      <Heading size="lg" color="#F0F6FC">Settings</Heading>

      <Box bg="#161B22" border="1px solid #30363D" borderRadius="lg" p={6}>
        <VStack gap={6} align="stretch">
          <HStack justify="space-between" align="center">
            <HStack gap={3}>
              <Box color={soundEnabled ? '#00D395' : '#6E7681'}>
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="600" color="#F0F6FC">Sound</Text>
                <Text fontSize="xs" color="#6E7681">Enable/disable sound effects</Text>
              </VStack>
            </HStack>
            <Switch.Root checked={soundEnabled} onCheckedChange={toggleSound}>
              <Switch.Control><Switch.Thumb /></Switch.Control>
            </Switch.Root>
          </HStack>

          <HStack justify="space-between" align="center">
            <HStack gap={3}>
              <Box color={animationsEnabled ? '#00D395' : '#6E7681'}>
                <Sparkles size={20} />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="600" color="#F0F6FC">Animations</Text>
                <Text fontSize="xs" color="#6E7681">Enable/disable animations</Text>
              </VStack>
            </HStack>
            <Switch.Root checked={animationsEnabled} onCheckedChange={toggleAnimations}>
              <Switch.Control><Switch.Thumb /></Switch.Control>
            </Switch.Root>
          </HStack>

          <HStack justify="space-between" align="center">
            <HStack gap={3}>
              <Box color="#FFB800"><Coins size={20} /></Box>
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="600" color="#F0F6FC">Currency format</Text>
                <Text fontSize="xs" color="#6E7681">Choose how to display balance</Text>
              </VStack>
            </HStack>
            <Select.Root
              value={[currencyFormat]}
              onValueChange={(e) => setCurrencyFormat(e.value[0] as 'credits' | 'coins' | 'gems')}
              collection={currencyCollection}
              w="160px"
            >
              <Select.Control>
                <Select.ValueText color="#F0F6FC" />
                <Select.Indicator />
              </Select.Control>
              <Select.Content>
                {currencyCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </HStack>
        </VStack>
      </Box>

      <Box bg="#161B22" border="1px solid #F85149" borderRadius="lg" p={6}>
        <VStack gap={4} align="stretch">
          <HStack gap={3}>
            <Box color="#F85149"><AlertTriangle size={20} /></Box>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" fontWeight="600" color="#F0F6FC">Danger zone</Text>
              <Text fontSize="xs" color="#6E7681">This action cannot be undone</Text>
            </VStack>
          </HStack>

          <Dialog.Root open={confirmOpen} onOpenChange={(e) => setConfirmOpen(e.open)} placement="center">
            <Dialog.Trigger asChild>
              <Button variant="outline" color="#F85149" borderColor="#F85149" _hover={{ bg: '#F85149', color: 'white' }}>
                Delete all data
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content bg="#161B22" border="1px solid #30363D">
                  <Dialog.Header>
                    <Dialog.Title color="#F0F6FC">Confirm deletion</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Text color="#8B949E">
                      All your data will be deleted including balance, bets and progress. This action is permanent.
                    </Text>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <Button variant="ghost" color="#6E7681">Cancel</Button>
                    </Dialog.CloseTrigger>
                    <Button bg="#F85149" color="white" onClick={handleReset}>Delete everything</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </VStack>
      </Box>
    </VStack>
  );
}
