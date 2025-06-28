import { Ticket } from '../entities/ticket.entity';

// Sorts an unordered list of tickets into a valid itinerary
export function sortTickets(tickets: Ticket[]): Ticket[] {
  if (tickets.length === 0) return [];

  const departureMap = new Map<string, Ticket>(); // Map each departure point to its ticket
  const arrivals = new Set<string>(); // Collect all arrival points

  for (const ticket of tickets) {
    departureMap.set(ticket.departure, ticket);
    arrivals.add(ticket.arrival);
  }

  // The starting point is the only departure location that is not also an arrival
  const start = tickets.find((t) => !arrivals.has(t.departure));
  if (!start) throw new Error('Could not determine the starting point.');

  const orderedTickets: Ticket[] = [];
  let current: Ticket | undefined = start;

  // Traverse the tickets from the starting point using arrival-to-departure chaining
  while (current) {
    orderedTickets.push(current);
    current = departureMap.get(current.arrival); // Go to the next ticket
  }

  return orderedTickets;
}
