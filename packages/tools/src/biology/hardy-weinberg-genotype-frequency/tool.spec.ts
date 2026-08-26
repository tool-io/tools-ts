import { describe, expect, it } from "vitest";
import {
  hardyWeinbergGenotypeFrequencyExample,
  runHardyWeinbergGenotypeFrequency,
} from "./tool.js";

describe("Genotype Frequencies", () => {
  it("matches the canonical example", () => {
    const result = runHardyWeinbergGenotypeFrequency(
      hardyWeinbergGenotypeFrequencyExample.input,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.expectedHomoDominant).toBeCloseTo(0.36, 12);
      expect(result.output.expectedHeterozygous).toBeCloseTo(0.48, 12);
      expect(result.output.expectedHomoRecessive).toBeCloseTo(0.16, 12);
    }
  });
  it("splits evenly at p of one half", () =>
    expect(
      runHardyWeinbergGenotypeFrequency({ alleleFrequencyP: 0.5 }),
    ).toEqual({
      ok: true,
      output: {
        expectedHomoDominant: 0.25,
        expectedHeterozygous: 0.5,
        expectedHomoRecessive: 0.25,
      },
    }));
  it("fixes all dominant at p of one", () =>
    expect(runHardyWeinbergGenotypeFrequency({ alleleFrequencyP: 1 })).toEqual({
      ok: true,
      output: {
        expectedHomoDominant: 1,
        expectedHeterozygous: 0,
        expectedHomoRecessive: 0,
      },
    }));
  it("fixes all recessive at p of zero", () =>
    expect(runHardyWeinbergGenotypeFrequency({ alleleFrequencyP: 0 })).toEqual({
      ok: true,
      output: {
        expectedHomoDominant: 0,
        expectedHeterozygous: 0,
        expectedHomoRecessive: 1,
      },
    }));
  it("frequencies sum to one", () => {
    const result = runHardyWeinbergGenotypeFrequency({
      alleleFrequencyP: 0.73,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        Number(result.output.expectedHomoDominant) +
          Number(result.output.expectedHeterozygous) +
          Number(result.output.expectedHomoRecessive),
      ).toBeCloseTo(1, 12);
  });
  it("rejects p above one", () =>
    expect(
      runHardyWeinbergGenotypeFrequency({ alleleFrequencyP: 1.5 }).ok,
    ).toBe(false));
  it("rejects negative p", () =>
    expect(
      runHardyWeinbergGenotypeFrequency({ alleleFrequencyP: -0.1 }).ok,
    ).toBe(false));
});
