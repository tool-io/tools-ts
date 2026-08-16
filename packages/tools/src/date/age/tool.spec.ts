import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { ageExample, ageTool, calculateAge } from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateAge>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Age Calculator", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = ageTool.execute(ageExample.input);
    expect(result).toEqual({ ok: true, output: ageExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(ageTool.id).toBe("date/age");
    expect(validateToolContract(ageTool)).toEqual([]);
  });

  it("handles month-end borrowing across short months", () => {
    // Born Jan 31; on Mar 1 there is no Feb 31 -> full 1 month + 1 day.
    const result = calculateAge({
      asOfDate: "2026-03-01",
      birthDate: "2026-01-31",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.years).toBe(0);
      expect(result.output.months).toBe(1);
      expect(result.output.days).toBe(1);
    }
  });

  it("treats the birthday itself as a completed year", () => {
    const result = calculateAge({
      asOfDate: "2025-06-15",
      birthDate: "1990-06-15",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.years).toBe(35);
  });

  it("rejects malformed and reversed ranges", () => {
    expect(calculateAge(null).ok).toBe(false);
    expect(issueCodes(calculateAge({}))).toEqual([
      "birth_date_required",
      "as_of_date_required",
    ]);
    expect(
      issueCodes(
        calculateAge({ asOfDate: "2026-02-30", birthDate: "2000-01-01" }),
      ),
    ).toEqual(["as_of_date_impossible"]);
    expect(
      issueCodes(
        calculateAge({ asOfDate: "2000-01-01", birthDate: "2020-05-05" }),
      ),
    ).toEqual(["range_reversed"]);
    expect(
      issueCodes(
        calculateAge({ asOfDate: "not-a-date", birthDate: "2020-05-05" }),
      ),
    ).toEqual(["as_of_date_invalid"]);
  });
});
