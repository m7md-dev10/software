export const APP_NAME = process.env.REACT_APP_NAME || 'Event Ticketing System';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const USER_ROLES = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
} as const;

export const EVENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
} as const;

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  MY_BOOKINGS: '/my-bookings',
  MY_EVENTS: '/my-events',
  MY_EVENTS_NEW: '/my-events/new',
  MY_EVENTS_EDIT: (id: string) => `/my-events/${id}/edit`,
  MY_EVENTS_ANALYTICS: '/my-events/analytics',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_USERS: '/admin/users',
  EVENT_DETAILS: (id: string) => `/events/${id}`,
  UNAUTHORIZED: '/unauthorized',
} as const; 