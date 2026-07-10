import { Heading } from '@chakra-ui/react';
import { EventList } from '../features/events/components/EventList';

export function EventsPage() {
  return (
    <>
      <Heading size="lg" color="#F0F6FC" mb={4}>Events</Heading>
      <EventList />
    </>
  );
}
