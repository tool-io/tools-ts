import { describe, expect, it } from "vitest";
import {
  runThreeAlleleHardyWeinberg,
  threeAlleleHardyWeinbergExample,
} from "./tool.js";

describe("Three Allele Frequencies", () => {
  it("publishes an executable example", () =>
    expect(
      runThreeAlleleHardyWeinberg(threeAlleleHardyWeinbergExample.input),
    ).toEqual({
      ok: true,
      output: threeAlleleHardyWeinbergExample.output,
    }));
  it("produces frequencies summing to one by construction", () => {
    const result = runThreeAlleleHardyWeinberg({
      genotypeCount11: 2,
      genotypeCount12: 4,
      genotypeCount13: 6,
      genotypeCount22: 8,
      genotypeCount23: 10,
      genotypeCount33: 20,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        Number(result.output.alleleFrequencyP1) +
          Number(result.output.alleleFrequencyP2) +
          Number(result.output.alleleFrequencyP3),
      ).toBeCloseTo(1, 12);
  });
  it("assigns everything to allele three for a fixed locus", () =>
    expect(
      runThreeAlleleHardyWeinberg({
        genotypeCount11: 0,
        genotypeCount12: 0,
        genotypeCount13: 0,
        genotypeCount22: 0,
        genotypeCount23: 0,
        genotypeCount33: 10,
      }),
    ).toEqual({
      ok: true,
      output: {
        alleleFrequencyP1: 0,
        alleleFrequencyP2: 0,
        alleleFrequencyP3: 1,
      },
    }));
  it("splits one heterozygote class across two alleles", () =>
    expect(
      runThreeAlleleHardyWeinberg({
        genotypeCount11: 0,
        genotypeCount12: 10,
        genotypeCount13: 0,
        genotypeCount22: 0,
        genotypeCount23: 0,
        genotypeCount33: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        alleleFrequencyP1: 0.5,
        alleleFrequencyP2: 0.5,
        alleleFrequencyP3: 0,
      },
    }));
  it("rejects all-zero counts", () =>
    expect(
      runThreeAlleleHardyWeinberg({
        genotypeCount11: 0,
        genotypeCount12: 0,
        genotypeCount13: 0,
        genotypeCount22: 0,
        genotypeCount23: 0,
        genotypeCount33: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative counts", () =>
    expect(
      runThreeAlleleHardyWeinberg({
        ...threeAlleleHardyWeinbergExample.input,
        genotypeCount12: -3,
      }).ok,
    ).toBe(false));
  it("rejects fractional counts", () =>
    expect(
      runThreeAlleleHardyWeinberg({
        ...threeAlleleHardyWeinbergExample.input,
        genotypeCount33: 4.5,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runThreeAlleleHardyWeinberg({}).ok).toBe(false));
});
