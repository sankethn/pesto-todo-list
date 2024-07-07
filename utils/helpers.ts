import { UUIDCHARACTER } from '@/utils/constants';
import { customAlphabet } from 'nanoid';

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

export const isPast = (someDate: Date) => {
  const today = new Date();
  return someDate < today && !isToday(someDate);
};

export const formatDueDate = (dueDate: string | number) => {
  const date = new Date(+dueDate);
  if (isPast(date)) {
    return `Past due at ${date.toLocaleTimeString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })}`;
  } if (isToday(date)) {
    return `Due today at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })}`;
  } if (isTomorrow(date)) {
    return `Due tomorrow at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })}`;
  }
  return `Due at ${date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })}`;
};

export const nanoid = customAlphabet(UUIDCHARACTER, 6);
