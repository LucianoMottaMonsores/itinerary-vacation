import { sortTickets } from './ticket-sorter';
import { Ticket } from '../entities/ticket.entity';

describe('sortTickets', () => {
  it('should return an empty array if no tickets provided', () => {
    expect(sortTickets([])).toEqual([]);
  });

  /* This test simulates a shuffled ticket list where:
   * - A → B
   * - B → C
   * - C → D
   * The function must identify the start point and sort them sequentially.
   */
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
    const departureSequence = sorted.map((t) => t.departure); // The resulting array should begin with the true departure point: 'A'.
    expect(departureSequence).toEqual(['A', 'B', 'C']);
  });

  /* In this scenario, the departure and arrival cities form a loop (A <- -> B),
   * so there is no unique starting point — which must trigger an error.
   */
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
    expect(() => sortTickets(looped)).toThrow('Could not determine the starting point.'); // The function should throw a specific error in this edge case.
  });
});
