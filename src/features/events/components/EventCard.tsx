import { Box, HStack, Text, Badge } from '@chakra-ui/react';
import { Clock } from 'lucide-react';
import type { FictionalEvent } from '../../../types';
import { CATEGORY_LABELS } from '../../../constants/events';
import { MIN_STAKE } from '../../../constants/betting';
import { useBetStore } from '../../../stores/betStore';
import { useUiStore } from '../../../stores/uiStore';
import { OddsButton } from './OddsButton';

interface EventCardProps {
  event: FictionalEvent;
}

function getTimeDisplay(event: FictionalEvent): string {
  if (event.status === 'live') {
    return 'Live';
  }
  if (event.status === 'finished') return 'Finished';

  const diff = event.startTime - Date.now();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Starts now';
  if (minutes < 60) return `In ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainMin = minutes % 60;
  return `In ${hours}h ${remainMin}m`;
}

export function EventCard({ event }: EventCardProps) {
  const betSlip = useBetStore((s) => s.betSlip);
  const addToBetSlip = useBetStore((s) => s.addToBetSlip);
  const openBetSlip = useUiStore((s) => s.openBetSlip);

  const isLive = event.status === 'live';
  const isFinished = event.status === 'finished';
  const isDisabled = isFinished;

  const homeInSlip = betSlip.find(
    (b) => b.eventId === event.id && b.selection === 'home'
  );
  const drawInSlip = betSlip.find(
    (b) => b.eventId === event.id && b.selection === 'draw'
  );
  const awayInSlip = betSlip.find(
    (b) => b.eventId === event.id && b.selection === 'away'
  );

  const eventSummary = `${event.homeTeam} vs ${event.awayTeam}`;

  function handleOddsClick(selection: 'home' | 'draw' | 'away', odds: number) {
    if (isDisabled) return;
    addToBetSlip({
      eventId: event.id,
      eventSummary,
      selection,
      odds,
      homeIcon: event.homeIcon,
      awayIcon: event.awayIcon,
    });
    openBetSlip();
  }

  return (
    <Box
      bg="#161B22"
      border="1px solid #30363D"
      borderRadius="lg"
      overflow="hidden"
      transition="border-color 0.2s"
      _hover={{ borderColor: '#484F58' }}
    >
      <Box px={4} pt={3} pb={2}>
        <HStack justify="space-between" mb={2}>
          <HStack gap={1.5}>
            <Badge
              bg="#21262D"
              color="#8B949E"
              fontSize="2xs"
              px={1.5}
              py={0.5}
              borderRadius="sm"
              textTransform="none"
            >
              {CATEGORY_LABELS[event.category]}
            </Badge>
            <Text fontSize="xs" color="#6E7681">
              {event.league}
            </Text>
          </HStack>
          <HStack gap={1.5}>
            {isLive && (
              <Badge
                bg="#F85149"
                color="white"
                fontSize="2xs"
                px={1.5}
                py={0.5}
                borderRadius="sm"
                textTransform="none"
                animation="pulse 2s infinite"
              >
                <Box
                  as="span"
                  display="inline-block"
                  w={1.5}
                  h={1.5}
                  bg="white"
                  borderRadius="full"
                  mr={1}
                  animation="pulse 2s infinite"
                />
                LIVE
              </Badge>
            )}
            <HStack gap={1} color="#6E7681">
              <Clock size={12} />
              <Text fontSize="xs">{getTimeDisplay(event)}</Text>
            </HStack>
          </HStack>
        </HStack>

        <HStack justify="space-between" align="center" mb={3}>
          <HStack gap={2} flex={1} minW={0}>
            <Text fontSize="xl">{event.homeIcon}</Text>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="#F0F6FC"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {event.homeTeam}
            </Text>
          </HStack>
          <Text fontSize="xs" color="#6E7681" fontWeight="500" px={2}>
            vs
          </Text>
          <HStack gap={2} flex={1} minW={0} justify="flex-end">
            <Text
              fontSize="sm"
              fontWeight="600"
              color="#F0F6FC"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              textAlign="right"
            >
              {event.awayTeam}
            </Text>
            <Text fontSize="xl">{event.awayIcon}</Text>
          </HStack>
        </HStack>
      </Box>

      <HStack
        gap={1}
        bg="#1C2128"
        px={3}
        py={2}
        borderTop="1px solid #30363D"
      >
        <OddsButton
          label="Home"
          odds={event.odds.home}
          potentialWin={Math.floor(MIN_STAKE * event.odds.home)}
          isSelected={!!homeInSlip}
          disabled={isDisabled}
          onClick={() => handleOddsClick('home', event.odds.home)}
        />
        {event.odds.draw !== null && (
          <OddsButton
            label="Draw"
            odds={event.odds.draw}
            potentialWin={Math.floor(MIN_STAKE * event.odds.draw)}
            isSelected={!!drawInSlip}
            disabled={isDisabled}
            onClick={() => handleOddsClick('draw', event.odds.draw!)}
          />
        )}
        <OddsButton
          label="Away"
          odds={event.odds.away}
          potentialWin={Math.floor(MIN_STAKE * event.odds.away)}
          isSelected={!!awayInSlip}
          disabled={isDisabled}
          onClick={() => handleOddsClick('away', event.odds.away)}
        />
      </HStack>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </Box>
  );
}
