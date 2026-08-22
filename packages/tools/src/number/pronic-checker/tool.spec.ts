import { describe, expect, it } from "vitest";
import { runPronicChecker } from "./tool.js";

describe("Pronic Number Checker", () => {
  it("calculates a valid result", () => {
    expect(runPronicChecker({ value: 12 })).toEqual({
      ok: true,
      output: { pronic: true },
    });
    expect(runPronicChecker({ value: 10 })).toEqual({
      ok: true,
      output: { pronic: false },
    });
  });

  it("accepts zero as pronic", () => {
    expect(runPronicChecker({ value: 0 })).toEqual({
      ok: true,
      output: { pronic: true },
    });
  });

  it("rejects invalid input", () =>
    expect(runPronicChecker(null).ok).toBe(false));
});
