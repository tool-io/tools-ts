import { describe, expect, it } from "vitest";
import { runGenomicEstimatedBreedingValue } from "./tool.js";

describe("GEBV Blend", () => {
  it("weights the genomic value over the pedigree value", () =>
    expect(
      runGenomicEstimatedBreedingValue({
        genomicEbv: 10,
        genomicWeight: 0.6,
        pedigreeEbv: 4,
      }),
    ).toEqual({
      ok: true,
      output: { genomicEstimatedBreedingValue: 7.6 },
    }));
  it("blends equally by default", () =>
    expect(
      runGenomicEstimatedBreedingValue({ genomicEbv: 8, pedigreeEbv: 2 }),
    ).toEqual({ ok: true, output: { genomicEstimatedBreedingValue: 5 } }));
  it("keeps signed breeding values", () =>
    expect(
      runGenomicEstimatedBreedingValue({
        genomicEbv: -4,
        pedigreeEbv: -2,
      }),
    ).toEqual({
      ok: true,
      output: { genomicEstimatedBreedingValue: -3 },
    }));
  it("returns the genomic EBV unchanged at full weight", () =>
    expect(
      runGenomicEstimatedBreedingValue({
        genomicEbv: 6.5,
        genomicWeight: 1,
        pedigreeEbv: -10,
      }),
    ).toEqual({
      ok: true,
      output: { genomicEstimatedBreedingValue: 6.5 },
    }));
  it("returns the pedigree EBV at zero weight", () =>
    expect(
      runGenomicEstimatedBreedingValue({
        genomicEbv: 100,
        genomicWeight: 0,
        pedigreeEbv: 3.25,
      }),
    ).toEqual({
      ok: true,
      output: { genomicEstimatedBreedingValue: 3.25 },
    }));
  it("rejects a weight above one", () => {
    const result = runGenomicEstimatedBreedingValue({
      genomicEbv: 1,
      genomicWeight: 1.5,
      pedigreeEbv: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects non finite genomic values", () => {
    const result = runGenomicEstimatedBreedingValue({
      genomicEbv: Number.POSITIVE_INFINITY,
      pedigreeEbv: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("genomicEbv");
  });
});
