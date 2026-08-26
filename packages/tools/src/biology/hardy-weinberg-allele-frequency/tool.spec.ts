import { describe, expect, it } from "vitest";
import {
  hardyWeinbergAlleleFrequencyExample,
  runHardyWeinbergAlleleFrequency,
} from "./tool.js";

describe("Allele Frequency p", () => {
  it("matches the canonical example", () => {
    const result = runHardyWeinbergAlleleFrequency(
      hardyWeinbergAlleleFrequencyExample.input,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.alleleFrequencyP).toBeCloseTo(0.6, 12);
  });
  it("returns p of one when all individuals are homozygous dominant", () =>
    expect(
      runHardyWeinbergAlleleFrequency({
        homozygousDominantCount: 10,
        heterozygousCount: 0,
        homozygousRecessiveCount: 0,
      }),
    ).toEqual({ ok: true, output: { alleleFrequencyP: 1 } }));
  it("returns p of zero when all individuals are homozygous recessive", () =>
    expect(
      runHardyWeinbergAlleleFrequency({
        homozygousDominantCount: 0,
        heterozygousCount: 0,
        homozygousRecessiveCount: 7,
      }),
    ).toEqual({ ok: true, output: { alleleFrequencyP: 0 } }));
  it("counts heterozygotes once toward p", () =>
    expect(
      runHardyWeinbergAlleleFrequency({
        homozygousDominantCount: 0,
        heterozygousCount: 50,
        homozygousRecessiveCount: 50,
      }),
    ).toEqual({ ok: true, output: { alleleFrequencyP: 0.25 } }));
  it("allows zero counts in some classes", () =>
    expect(
      runHardyWeinbergAlleleFrequency({
        homozygousDominantCount: 3,
        heterozygousCount: 1,
        homozygousRecessiveCount: 0,
      }),
    ).toEqual({ ok: true, output: { alleleFrequencyP: 0.875 } }));
  it("rejects all-zero counts", () =>
    expect(
      runHardyWeinbergAlleleFrequency({
        homozygousDominantCount: 0,
        heterozygousCount: 0,
        homozygousRecessiveCount: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative counts", () =>
    expect(
      runHardyWeinbergAlleleFrequency({
        homozygousDominantCount: -1,
        heterozygousCount: 4,
        homozygousRecessiveCount: 5,
      }).ok,
    ).toBe(false));
});
