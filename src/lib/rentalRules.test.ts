import { describe, expect, it } from "vitest";
import {
  DAILY_PENALTY_PLN,
  MAX_RENTAL_DAYS,
  RENTAL_OPTIONS,
  getDueDateFromNow,
  getRentalSummary
} from "./rentalRules";

describe("rental rules", () => {
  it("limits rental options to one month", () => {
    expect(Math.max(...RENTAL_OPTIONS.map((option) => option.days))).toBe(MAX_RENTAL_DAYS);
  });

  it("creates due date from selected rental length", () => {
    const now = new Date(2026, 4, 1, 10, 0, 0, 0);
    const dueDate = new Date(getDueDateFromNow(14, now));

    expect(dueDate.getFullYear()).toBe(2026);
    expect(dueDate.getMonth()).toBe(4);
    expect(dueDate.getDate()).toBe(15);
    expect(dueDate.getHours()).toBe(23);
    expect(dueDate.getMinutes()).toBe(59);
    expect(dueDate.getSeconds()).toBe(59);
    expect(dueDate.getMilliseconds()).toBe(999);
  });

  it("calculates days left before due date", () => {
    const now = new Date(2026, 4, 10, 8, 0, 0, 0);
    const dueDate = new Date(2026, 4, 17, 23, 59, 59, 999);
    const summary = getRentalSummary(dueDate, now);

    expect(summary.daysLeft).toBe(7);
    expect(summary.isOverdue).toBe(false);
    expect(summary.penalty).toBe(0);
  });

  it("calculates overdue penalty", () => {
    const now = new Date(2026, 4, 10, 8, 0, 0, 0);
    const dueDate = new Date(2026, 4, 6, 23, 59, 59, 999);
    const summary = getRentalSummary(dueDate, now);

    expect(summary.overdueDays).toBe(4);
    expect(summary.isOverdue).toBe(true);
    expect(summary.penalty).toBe(4 * DAILY_PENALTY_PLN);
  });

  it("rejects rental periods above one month", () => {
    expect(() => getDueDateFromNow(31)).toThrow("1-30 dni");
  });
});
