const DAY_MS = 24 * 60 * 60 * 1000;

export const MAX_RENTAL_DAYS = 30;

export const DAILY_PENALTY_PLN = 2.5;

export const RENTAL_OPTIONS = [
  { days: 7, label: "7 dni" },
  { days: 14, label: "14 dni" },
  { days: 21, label: "21 dni" },
  { days: 30, label: "30 dni" }
] as const;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const assertRentalDays = (days: number) => {
  if (!Number.isInteger(days) || days < 1 || days > MAX_RENTAL_DAYS) {
    throw new Error(`Termin wypożyczenia musi mieścić się w zakresie 1-${MAX_RENTAL_DAYS} dni.`);
  }
};

export const getDueDateFromNow = (days: number, now = new Date()) => {
  assertRentalDays(days);
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + days);
  dueDate.setHours(23, 59, 59, 999);
  return dueDate.toISOString();
};

export const getDaysLeft = (dueDate: string | Date, now = new Date()) => {
  const due = new Date(dueDate);
  return Math.ceil((startOfDay(due) - startOfDay(now)) / DAY_MS);
};

export const getRentalSummary = (dueDate: string | Date, now = new Date()) => {
  const daysLeft = getDaysLeft(dueDate, now);
  const overdueDays = Math.max(0, -daysLeft);
  const penalty = overdueDays * DAILY_PENALTY_PLN;

  return {
    daysLeft,
    overdueDays,
    penalty,
    isOverdue: overdueDays > 0
  };
};

export const formatPenalty = (amount: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(amount);
