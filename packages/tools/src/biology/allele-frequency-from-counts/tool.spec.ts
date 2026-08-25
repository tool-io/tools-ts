import { describe, expect, it } from "vitest";
import {
  alleleFrequencyFromCountsExample,
  runAlleleFrequencyFromCounts,
} from "./tool.js";

describe("Allele Freq From Counts", () => {
  it("matches the canonical example", () => {
    const result = runAlleleFrequencyFromCounts(
      alleleFrequencyFromCountsExample.input,
    );
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.alleleAFrequency).toBeCloseTo(
        0.5833333333333334,
        12,
      );
  });
  it("returns one when only AA is present", () =>
    expect(
      runAlleleFrequencyFromCounts({ countAA: 25, countAB: 0, countBB: 0 }),
    ).toEqual({ ok: true, output: { alleleAFrequency: 1 } }));
  it("returns zero when no A alleles exist", () =>
    expect(
      runAlleleFrequencyFromCounts({ countAA: 0, countAB: 0, countBB: 18 }),
    ).toEqual({ ok: true, output: { alleleAFrequency: 0 } }));
  it("counts heterozygotes as half A", () =>
    expect(
      runAlleleFrequencyFromCounts({ countAA: 0, countAB: 10, countBB: 10 }),
    ).toEqual({ ok: true, output: { alleleAFrequency: 0.25 } }));
  it("allows zero counts in some classes", () =>
    expect(
      runAlleleFrequencyFromCounts({ countAA: 4, countAB: 4, countBB: 0 }),
    ).toEqual({ ok: true, output: { alleleAFrequency: 0.75 } }));
  it("rejects all-zero counts", () =>
    expect(
      runAlleleFrequencyFromCounts({ countAA: 0, countAB: 0, countBB: 0 }).ok,
    ).toBe(false));
  it("rejects negative counts", () =>
    expect(
      runAlleleFrequencyFromCounts({ countAA: -2, countAB: 1, countBB: 1 }).ok,
    ).toBe(false));
});
