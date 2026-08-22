import { describe, expect, it } from "vitest";
import { daysInQuarterExample, runDaysInQuarter } from "./tool.js";

describe("Days in Quarter Calculator", () => {
  it("calculates the canonical example", () =>
    expect(runDaysInQuarter(daysInQuarterExample.input)).toEqual({
      ok: true,
      output: daysInQuarterExample.output,
    }));
  it("returns 91 days for the second quarter", () => {
    expect(runDaysInQuarter({ date: "2023-04-01" })).toEqual({
      ok: true,
      output: { daysInQuarter: 91 },
    });
    expect(runDaysInQuarter({ date: "2024-06-30" })).toEqual({
      ok: true,
      output: { daysInQuarter: 91 },
    });
  });
  it("returns 92 days for the third and fourth quarters", () => {
    expect(runDaysInQuarter({ date: "2024-07-01" })).toEqual({
      ok: true,
      output: { daysInQuarter: 92 },
    });
    expect(runDaysInQuarter({ date: "2024-12-31" })).toEqual({
      ok: true,
      output: { daysInQuarter: 92 },
    });
  });
  it("returns 91 days in a leap-year first quarter", () => {
    expect(runDaysInQuarter({ date: "2024-01-01" })).toEqual({
      ok: true,
      output: { daysInQuarter: 91 },
    });
    expect(runDaysInQuarter({ date: "2024-03-31" })).toEqual({
      ok: true,
      output: { daysInQuarter: 91 },
    });
  });
  it("returns 90 days in a non-leap first quarter", () => {
    expect(runDaysInQuarter({ date: "2023-02-28" })).toEqual({
      ok: true,
      output: { daysInQuarter: 90 },
    });
    expect(runDaysInQuarter({ date: "2023-03-31" })).toEqual({
      ok: true,
      output: { daysInQuarter: 90 },
    });
  });
  it("treats century non-leap years correctly", () => {
    expect(runDaysInQuarter({ date: "1900-03-01" })).toEqual({
      ok: true,
      output: { daysInQuarter: 90 },
    });
    expect(runDaysInQuarter({ date: "2000-02-29" })).toEqual({
      ok: true,
      output: { daysInQuarter: 91 },
    });
  });
  it("rejects malformed dates with invalid_date", () => {
    const result = runDaysInQuarter({ date: "2024/05/15" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_date");
  });
  it("rejects impossible calendar dates with invalid_date", () => {
    expect(runDaysInQuarter({ date: "2023-02-29" }).ok).toBe(false);
    const result = runDaysInQuarter({ date: "2024-13-01" });
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_date");
  });
  it("rejects missing and malformed input", () => {
    expect(runDaysInQuarter(null).ok).toBe(false);
    expect(runDaysInQuarter({}).ok).toBe(false);
    expect(runDaysInQuarter({ date: 15 }).ok).toBe(false);
  });
});
