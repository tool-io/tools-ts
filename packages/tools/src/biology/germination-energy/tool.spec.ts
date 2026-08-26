import { describe, expect, it } from "vitest";
import { germinationEnergyExample, runGerminationEnergy } from "./tool.js";

describe("Germination Energy %", () => {
  it("publishes an executable example", () =>
    expect(runGerminationEnergy(germinationEnergyExample.input)).toEqual({
      ok: true,
      output: germinationEnergyExample.output,
    }));
  it("returns zero when nothing has germinated by the peak day", () =>
    expect(
      runGerminationEnergy({ germinatedByPeakDayInt: 0, seedsSownInt: 40 }),
    ).toEqual({
      ok: true,
      output: { germinationEnergyPercent: 0 },
    }));
  it("returns one hundred when all seeds are in by the peak day", () =>
    expect(
      runGerminationEnergy({ germinatedByPeakDayInt: 30, seedsSownInt: 30 }),
    ).toEqual({
      ok: true,
      output: { germinationEnergyPercent: 100 },
    }));
  it("supports repeating fractions", () => {
    const result = runGerminationEnergy({
      germinatedByPeakDayInt: 1,
      seedsSownInt: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.germinationEnergyPercent).toBeCloseTo(100 / 3, 12);
  });
  it("rejects peak-day counts exceeding sown seeds", () => {
    const result = runGerminationEnergy({
      germinatedByPeakDayInt: 21,
      seedsSownInt: 20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects zero seeds sown", () =>
    expect(
      runGerminationEnergy({ germinatedByPeakDayInt: 0, seedsSownInt: 0 }).ok,
    ).toBe(false));
  it("rejects non-integer counts", () =>
    expect(
      runGerminationEnergy({ germinatedByPeakDayInt: 3.5, seedsSownInt: 10 })
        .ok,
    ).toBe(false));
});
