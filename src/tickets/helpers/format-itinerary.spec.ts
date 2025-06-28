import { formatItinerary } from './format-itinerary';
import { Ticket } from '../entities/ticket.entity';

describe('formatItinerary', () => {
  it('should generate formatted instructions from itinerary', () => {
    const itinerary: Ticket[] = [
      {
        departure: 'A',
        arrival: 'B',
        transportNumber: '123',
        gate: 'G1',
        seat: '4A',
        luggageInfo: 'Drop bag at counter',
        transportType: { name: 'flight' },
      } as Ticket,
      {
        departure: 'B',
        arrival: 'C',
        transportType: { name: 'bus' },
        additionalInfo: 'Boarding at stop 5',
      } as Ticket,
    ];

    const output = formatItinerary(itinerary);
    expect(output[0]).toBe('0. Start.');
    expect(output[1]).toContain('board the flight');
    expect(output[2]).toContain('Board the airport bus');
    expect(output[3]).toBe('3. Last destination reached.');
  });
});
