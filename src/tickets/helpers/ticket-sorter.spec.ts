import { sortTickets } from './ticket-sorter';
import { Ticket } from '../entities/ticket.entity';

describe('sortTickets', () => {
  it('should return an empty array if no tickets provided', () => {
    expect(sortTickets([])).toEqual([]);
  });

  it('should correctly sort unordered tickets into itinerary', () => {
    const tickets: Ticket[] = [
      {
        departure: 'B',
        arrival: 'C',
        transportType: { name: 'bus' },
      } as Ticket,
      {
        departure: 'A',
        arrival: 'B',
        transportType: { name: 'bus' },
      } as Ticket,
      {
        departure: 'C',
        arrival: 'D',
        transportType: { name: 'bus' },
      } as Ticket,
    ];

    const sorted = sortTickets(tickets);
    const departureSequence = sorted.map((t) => t.departure);
    expect(departureSequence).toEqual(['A', 'B', 'C']);
  });

  it('should throw an error if no valid starting point exists', () => {
    const looped: Ticket[] = [
      {
        departure: 'A',
        arrival: 'B',
        transportType: { name: 'bus' },
      } as Ticket,
      {
        departure: 'B',
        arrival: 'A',
        transportType: { name: 'bus' },
      } as Ticket,
    ];
    expect(() => sortTickets(looped)).toThrow('Could not determine the starting point.');
  });
});
