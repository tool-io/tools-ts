import { describe, expect, it } from "vitest";
import {
  calculateRecurrenceRule,
  recurrenceRuleExample,
  runRecurrenceRule,
} from "./tool.js";

describe("date/recurrence-rule", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRecurrenceRule(recurrenceRuleExample.input)).toEqual({
      ok: true,
      output: recurrenceRuleExample.output,
    });
  });

  it("rejects malformed and impossible dates with structured errors", () => {
    const malformed = runRecurrenceRule({
      count: 1,
      frequency: "daily",
      interval: 1,
      startDate: "2024/01/31",
    });
    expect(malformed.ok).toBe(false);
    if (!malformed.ok)
      expect(malformed.error.issues[0]?.code).toBe("invalid_date");
    const impossible = runRecurrenceRule({
      count: 1,
      frequency: "daily",
      interval: 1,
      startDate: "2023-02-29",
    });
    expect(impossible.ok).toBe(false);
    if (!impossible.ok)
      expect(impossible.error.issues[0]?.code).toBe("invalid_date");
  });

  it("steps daily and weekly recurrences across month boundaries", () => {
    const daily = calculateRecurrenceRule({
      count: 3,
      frequency: "daily",
      interval: 1,
      startDate: "2024-03-30",
    });
    expect(daily.occurrences).toEqual([
      "2024-03-30",
      "2024-03-31",
      "2024-04-01",
    ]);
    const fortnightly = calculateRecurrenceRule({
      count: 2,
      frequency: "weekly",
      interval: 2,
      startDate: "2024-01-01",
    });
    expect(fortnightly.occurrences).toEqual(["2024-01-01", "2024-01-15"]);
  });

  it("clamps leap-day yearly recurrences to Feb 28 in common years", () => {
    const yearly = calculateRecurrenceRule({
      count: 3,
      frequency: "yearly",
      interval: 1,
      startDate: "2024-02-29",
    });
    expect(yearly.occurrences).toEqual([
      "2024-02-29",
      "2025-02-28",
      "2026-02-28",
    ]);
  });
});
