import { describe, expect, it } from "vitest";
import { pielouCorrectedExample, runPielouCorrected } from "./tool.js";

describe("Pielou Corrected", () => {
  it("publishes an executable example", () =>
    expect(runPielouCorrected(pielouCorrectedExample.input)).toEqual({
      ok: true,
      output: pielouCorrectedExample.output,
    }));
  it("outputs exactly zero for zero entropy", () =>
    expect(runPielouCorrected({ hNatural: 0, speciesCountInt: 5 })).toEqual({
      ok: true,
      output: { pielouCorrectedEvenness: 0 },
    }));
  it("reaches one at maximal even entropy", () =>
    expect(
      runPielouCorrected({
        hNatural: Math.log(3),
        speciesCountInt: 3,
      }),
    ).toEqual({ ok: true, output: { pielouCorrectedEvenness: 1 } }));
  it("stays below one for partial evenness", () => {
    const result = runPielouCorrected({
      hNatural: 0.5,
      speciesCountInt: 8,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.pielouCorrectedEvenness).toBeGreaterThan(0);
      expect(result.output.pielouCorrectedEvenness).toBeLessThan(1);
    }
  });
  it("scales inversely with species count", () => {
    const narrow = runPielouCorrectedSafe({
      hNatural: 0.5,
      speciesCountInt: 2,
    });
    const wide = runPielouCorrectedSafe({ hNatural: 0.5, speciesCountInt: 10 });
    expect(narrow).toBeGreaterThan(wide);
  });
  it("rejects a single-species community", () =>
    expect(runPielouCorrected({ hNatural: 0.5, speciesCountInt: 1 }).ok).toBe(
      false,
    ));
  it("rejects negative entropy", () =>
    expect(runPielouCorrected({ hNatural: -0.5, speciesCountInt: 4 }).ok).toBe(
      false,
    ));
  it("rejects entropy above the maximum for the species count", () =>
    expect(runPielouCorrected({ hNatural: 1, speciesCountInt: 2 }).ok).toBe(
      false,
    ));
});

const runPielouCorrectedSafe = (input: {
  readonly hNatural: number;
  readonly speciesCountInt: number;
}): number => {
  const result = runPielouCorrected(input);
  if (!result.ok) throw new Error("expected success");
  return Number(result.output.pielouCorrectedEvenness);
};
