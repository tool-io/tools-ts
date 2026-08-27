import { describe, expect, it } from "vitest";
import { runPrimerHairpinCheck } from "./tool.js";

describe("Primer Hairpin Risk", () => {
  it("calculates a valid result", () =>
    expect(runPrimerHairpinCheck({ sequence: "ACGTTTTACGT" })).toEqual({
      ok: true,
      output: { hairpinRisk: true, longestMatch: 4 },
    }));
  it("passes a sequence without complementary windows", () =>
    expect(runPrimerHairpinCheck({ sequence: "ACGTAAAA" })).toEqual({
      ok: true,
      output: { hairpinRisk: false, longestMatch: 0 },
    }));
  it("does not count overlapping windows as a hairpin", () =>
    expect(runPrimerHairpinCheck({ sequence: "ACGTACGT" })).toEqual({
      ok: true,
      output: { hairpinRisk: false, longestMatch: 0 },
    }));
  it("finds longer non-overlapping stems around a loop", () =>
    expect(runPrimerHairpinCheck({ sequence: "AACGTTTTAACGTT" })).toEqual({
      ok: true,
      output: { hairpinRisk: true, longestMatch: 5 },
    }));
  it("rejects sequences shorter than eight bases", () => {
    const result = runPrimerHairpinCheck({ sequence: "ACGTACG" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
  it("rejects non-DNA characters", () => {
    const result = runPrimerHairpinCheck({ sequence: "acgtacgt" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
