import { describe, expect, it } from "vitest";
import { runPrimerDimerCheck } from "./tool.js";

describe("Primer Dimer Risk", () => {
  it("calculates a valid result", () =>
    expect(
      runPrimerDimerCheck({ primerA: "TTACGT", primerB: "GGACGT" }),
    ).toEqual({
      ok: true,
      output: { maxComplementaryOverlap: 4, dimerRisk: true },
    }));
  it("matches a self-complementary primer over its full length", () =>
    expect(
      runPrimerDimerCheck({ primerA: "ACGTACGT", primerB: "ACGTACGT" }),
    ).toEqual({
      ok: true,
      output: { maxComplementaryOverlap: 8, dimerRisk: true },
    }));
  it("detects complementary homopolymer primers", () =>
    expect(runPrimerDimerCheck({ primerA: "AAAA", primerB: "TTTT" })).toEqual({
      ok: true,
      output: { maxComplementaryOverlap: 4, dimerRisk: true },
    }));
  it("stays low risk below four complementary bases", () =>
    expect(runPrimerDimerCheck({ primerA: "ACGT", primerB: "TTCA" })).toEqual({
      ok: true,
      output: { maxComplementaryOverlap: 1, dimerRisk: false },
    }));
  it("rejects non-DNA characters", () => {
    const result = runPrimerDimerCheck({ primerA: "ACGN", primerB: "ACGT" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
