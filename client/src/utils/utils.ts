import { format, formatDistanceStrict } from 'date-fns';

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

function formatDistanceCustom(token: string, count: number, options?: any) {
  const result = formatDistanceLocale[token as keyof typeof formatDistanceLocale].replace('{{count}}', count.toString());
  if (options?.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result;
    } else {
      return result + ' ago';
    }
  }
  return result;
}

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'PPP');
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'PPP p');
};

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceStrict(new Date(date), new Date(), {
    addSuffix: true,
    locale: {
      formatDistance: formatDistanceCustom,
    },
  });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatTicketCount = (available: number, total: number) => {
  if (available === 0) {
    return 'Sold Out';
  }
  if (available <= 10) {
    return `Only ${available} tickets left`;
  }
  return `${available} / ${total} tickets available`;
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'declined':
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'error';
    case 'organizer':
      return 'warning';
    case 'user':
      return 'success';
    default:
      return 'default';
  }
};

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateTicketCount = (count: number, available: number) => {
  return count > 0 && count <= available;
}; 