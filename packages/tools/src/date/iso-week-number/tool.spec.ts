import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateIsoWeekNumber,
  isoWeekNumberExample,
  isoWeekNumberTool,
} from "./tool.js";

describe("ISO Week Number", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = isoWeekNumberTool.execute(isoWeekNumberExample.input);
    expect(result).toEqual({ ok: true, output: isoWeekNumberExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(isoWeekNumberTool.id).toBe("date/iso-week-number");
    expect(validateToolContract(isoWeekNumberTool)).toEqual([]);
  });

  it("assigns early January days to the previous week-year", () => {
    // 2021-01-01 was a Friday in ISO 2020-W53.
    const result = calculateIsoWeekNumber({ date: "2021-01-01" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.week).toBe(53);
      expect(result.output.weekYear).toBe(2020);
    }
  });

  it("starts weeks on Mondays", () => {
    const monday = calculateIsoWeekNumber({ date: "2026-08-17" });
    expect(monday.ok).toBe(true);
    if (monday.ok) {
      expect(monday.output.week).toBe(34);
      expect(monday.output.weekYear).toBe(2026);
    }
  });

  it("rejects malformed dates", () => {
    expect(calculateIsoWeekNumber(null).ok).toBe(false);
    expect(calculateIsoWeekNumber({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateIsoWeekNumber({ date: "2026-02-30" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateIsoWeekNumber({ date: "x" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateIsoWeekNumber({ date: "2026-01-01", extra: true }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
