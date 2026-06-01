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
    const now = new Date("2026-05-01T10:00:00.000Z");
    const dueDate = getDueDateFromNow(14, now);

    expect(dueDate).toBe("2026-05-15T21:59:59.999Z");
  });

  it("calculates days left before due date", () => {
    const now = new Date("2026-05-10T08:00:00.000Z");
    const summary = getRentalSummary("2026-05-17T21:59:59.999Z", now);

    expect(summary.daysLeft).toBe(7);
    expect(summary.isOverdue).toBe(false);
    expect(summary.penalty).toBe(0);
  });

  it("calculates overdue penalty", () => {
    const now = new Date("2026-05-10T08:00:00.000Z");
    const summary = getRentalSummary("2026-05-06T21:59:59.999Z", now);

    expect(summary.overdueDays).toBe(4);
    expect(summary.isOverdue).toBe(true);
    expect(summary.penalty).toBe(4 * DAILY_PENALTY_PLN);
  });

  it("rejects rental periods above one month", () => {
    expect(() => getDueDateFromNow(31)).toThrow("1-30 dni");
  });
});
