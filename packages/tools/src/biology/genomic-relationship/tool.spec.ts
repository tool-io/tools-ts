import { describe, expect, it } from "vitest";
import { runGenomicRelationship } from "./tool.js";

describe("VanRaden Genomic Relationship", () => {
  it("scales the centered cross-product", () =>
    expect(
      runGenomicRelationship({
        alleleFrequencyVarianceSum: 10,
        centeredGenotypeCrossProduct: 10,
      }),
    ).toEqual({ ok: true, output: { genomicRelationship: 0.5 } }));
  it("returns zero for an orthogonal centered marker profile", () =>
    expect(
      runGenomicRelationship({
        alleleFrequencyVarianceSum: 4,
        centeredGenotypeCrossProduct: 0,
      }),
    ).toEqual({ ok: true, output: { genomicRelationship: 0 } }));
  it("can return one under unit scaling", () =>
    expect(
      runGenomicRelationship({
        alleleFrequencyVarianceSum: 3,
        centeredGenotypeCrossProduct: 6,
      }),
    ).toEqual({ ok: true, output: { genomicRelationship: 1 } }));
  it("preserves negative relationships after centering", () =>
    expect(
      runGenomicRelationship({
        alleleFrequencyVarianceSum: 2,
        centeredGenotypeCrossProduct: -1,
      }),
    ).toEqual({ ok: true, output: { genomicRelationship: -0.25 } }));
  it("allows estimates above one", () =>
    expect(
      runGenomicRelationship({
        alleleFrequencyVarianceSum: 2,
        centeredGenotypeCrossProduct: 5,
      }),
    ).toEqual({ ok: true, output: { genomicRelationship: 1.25 } }));
  it("rejects a zero scaling sum", () =>
    expect(
      runGenomicRelationship({
        alleleFrequencyVarianceSum: 0,
        centeredGenotypeCrossProduct: 1,
      }).ok,
    ).toBe(false));
});
