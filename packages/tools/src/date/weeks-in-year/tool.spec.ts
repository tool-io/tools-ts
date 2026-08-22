import { describe, expect, it } from "vitest";
import { runWeeksInYear, weeksInYearExample } from "./tool.js";

describe("Weeks in Year Calculator", () => {
  it("calculates the canonical example", () =>
    expect(runWeeksInYear(weeksInYearExample.input)).toEqual({
      ok: true,
      output: weeksInYearExample.output,
    }));
  it("returns 53 weeks when January first is a Thursday", () => {
    expect(runWeeksInYear({ year: 2015 })).toEqual({
      ok: true,
      output: { weeksInYear: 53 },
    });
    expect(runWeeksInYear({ year: 2021 })).toEqual({
      ok: true,
      output: { weeksInYear: 52 },
    });
  });
  it("returns 53 weeks for a leap year starting on Wednesday", () => {
    expect(runWeeksInYear({ year: 2020 })).toEqual({
      ok: true,
      output: { weeksInYear: 53 },
    });
  });
  it("returns 52 weeks for ordinary years", () => {
    expect(runWeeksInYear({ year: 2019 })).toEqual({
      ok: true,
      output: { weeksInYear: 52 },
    });
    expect(runWeeksInYear({ year: 2024 })).toEqual({
      ok: true,
      output: { weeksInYear: 52 },
    });
  });
  it("derives the year from an ISO date string", () => {
    expect(runWeeksInYear({ date: "2024-05-15" })).toEqual({
      ok: true,
      output: { weeksInYear: 52 },
    });
    expect(runWeeksInYear({ date: "2026-01-01" })).toEqual({
      ok: true,
      output: { weeksInYear: 53 },
    });
  });
  it("reports the calendar year for dates at ISO week-year boundaries", () => {
    expect(runWeeksInYear({ date: "2024-12-30" })).toEqual({
      ok: true,
      output: { weeksInYear: 52 },
    });
    expect(runWeeksInYear({ date: "2021-01-01" })).toEqual({
      ok: true,
      output: { weeksInYear: 52 },
    });
  });
  it("rejects providing neither input with missing_input", () => {
    const result = runWeeksInYear({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("missing_input");
  });
  it("rejects providing both inputs with conflicting_inputs", () => {
    const result = runWeeksInYear({ date: "2024-05-15", year: 2024 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("conflicting_inputs");
  });
  it("rejects malformed dates with invalid_date", () => {
    const result = runWeeksInYear({ date: "2024-02-30" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_date");
  });
  it("rejects out-of-range years and malformed input", () => {
    expect(runWeeksInYear({ year: 0 }).ok).toBe(false);
    expect(runWeeksInYear({ year: 10000 }).ok).toBe(false);
    expect(runWeeksInYear(null).ok).toBe(false);
    expect(runWeeksInYear({ year: "2026" }).ok).toBe(false);
  });
});
