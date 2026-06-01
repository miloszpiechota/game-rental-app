const formatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

export const formatDate = (date: string | Date) => formatter.format(new Date(date));

export const todayIso = () => new Date().toISOString();

export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const subtractDays = (date: Date, days: number) => addDays(date, -days);
