import { Ticket } from '../entities/ticket.entity';

type Formatter = (ticket: Ticket) => string;

/* Define formatters for each transport type.
 * Each formatter creates a more readable string based on the ticket details.
 */
const formatters: Record<string, Formatter> = {
  flight: (ticket: Ticket) => {
    let line = `From ${ticket.departure}, board the flight ${ticket.transportNumber} to ${ticket.arrival}`;
    if (ticket.gate) line += ` from gate ${ticket.gate}`;
    if (ticket.seat) line += `, seat ${ticket.seat}`;
    line += '.';
    if (ticket.luggageInfo) line += ` ${ticket.luggageInfo}.`;
    return line;
  },

  bus: (ticket: Ticket) => {
    let line = `Board the airport bus from ${ticket.departure} to ${ticket.arrival}.`;
    if (ticket.additionalInfo) line += ` ${ticket.additionalInfo}.`;
    return line;
  },

  train: (ticket: Ticket) => {
    let line = `Board train ${ticket.transportNumber}`;
    if (ticket.additionalInfo) line += `, ${ticket.additionalInfo}`;
    line += ` from ${ticket.departure} to ${ticket.arrival}.`;
    if (ticket.seat) line += ` Seat number ${ticket.seat}.`;
    return line;
  },

  tram: (ticket: Ticket) => {
    let line = `Board the tram ${ticket.transportNumber}`;
    if (ticket.additionalInfo) line += `, ${ticket.additionalInfo}`;
    line += ` from ${ticket.departure} to ${ticket.arrival}.`;
    if (ticket.seat) line += ` Seat number ${ticket.seat}.`;
    return line;
  },
};

// Generates a list of formatted travel instructions based on the sorted itinerary
export function formatItinerary(itinerary: Ticket[]): string[] {
  const instructions: string[] = ['0. Start.'];

  itinerary.forEach((ticket, idx) => {
    const formatter = formatters[ticket.transportType.name.toLowerCase()];
    const description = formatter
      ? formatter(ticket)
      : `Board ${ticket.transportType.name} from ${ticket.departure} to ${ticket.arrival}.`;

    instructions.push(`${idx + 1}. ${description.trim()}`);
  });

  instructions.push(`${instructions.length}. Last destination reached.`);
  return instructions;
}
