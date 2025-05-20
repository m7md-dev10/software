export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  status: 'pending' | 'approved' | 'declined';
  image?: string;
  organizer: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Booking {
  id: string;
  eventId: string;
  event: {
    title: string;
    date: string;
    location: string;
    price: number;
  };
  userId: string;
  ticketCount: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface EventStats {
  eventId: string;
  title: string;
  totalTickets: number;
  soldTickets: number;
  availableTickets: number;
  revenue: number;
  bookingsByDay: {
    date: string;
    count: number;
  }[];
} 