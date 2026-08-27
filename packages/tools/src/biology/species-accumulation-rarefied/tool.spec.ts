import { describe, expect, it } from "vitest";
import {
  runSpeciesAccumulationRarefied,
  speciesAccumulationRarefiedExample,
} from "./tool.js";

describe("Rarefied Species Curve Point", () => {
  it("publishes an executable example", () =>
    expect(
      runSpeciesAccumulationRarefied(speciesAccumulationRarefiedExample.input),
    ).toEqual({ ok: true, output: speciesAccumulationRarefiedExample.output }));
  it("reaches half saturation richness at the default half-saturation", () =>
    expect(
      runSpeciesAccumulationRarefied({
        sampleInt: 50,
        speciesTotalInt: 20,
        totalIndividualsInt: 100,
      }),
    ).toEqual({ ok: true, output: { rarefiedSpeciesCount: 10 } }));
  it("defaults the half-saturation to the rounded-up half of totals", () =>
    expect(
      runSpeciesAccumulationRarefied({
        sampleInt: 100,
        speciesTotalInt: 20,
        totalIndividualsInt: 101,
      }),
    ).toEqual({
      ok: true,
      output: {
        rarefiedSpeciesCount: (20 * 100) / (100 + 51),
      },
    }));
  it("honors an explicit half-saturation override", () =>
    expect(
      runSpeciesAccumulationRarefied({
        halfSaturationInt: 15,
        sampleInt: 10,
        speciesTotalInt: 12,
        totalIndividualsInt: 30,
      }),
    ).toEqual({ ok: true, output: { rarefiedSpeciesCount: 4.8 } }));
  it("approaches the full richness for a full census", () => {
    const result = runSpeciesAccumulationRarefied({
      sampleInt: 200,
      speciesTotalInt: 20,
      totalIndividualsInt: 200,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.rarefiedSpeciesCount).toBeCloseTo(
        13.333333333333334,
        12,
      );
  });
  it("stays monotonic in sample size", () => {
    const small = runSpeciesAccumulationRarefied({
      sampleInt: 10,
      speciesTotalInt: 30,
      totalIndividualsInt: 90,
    });
    const large = runSpeciesAccumulationRarefied({
      sampleInt: 80,
      speciesTotalInt: 30,
      totalIndividualsInt: 90,
    });
    expect(small.ok).toBe(true);
    expect(large.ok).toBe(true);
    if (small.ok && large.ok)
      expect(large.output.rarefiedSpeciesCount).toBeGreaterThan(
        Number(small.output.rarefiedSpeciesCount),
      );
  });
  it("rejects oversampling", () => {
    const result = runSpeciesAccumulationRarefied({
      sampleInt: 201,
      speciesTotalInt: 20,
      totalIndividualsInt: 200,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("oversample");
  });
  it("rejects zero species totals", () =>
    expect(
      runSpeciesAccumulationRarefied({
        sampleInt: 10,
        speciesTotalInt: 0,
        totalIndividualsInt: 100,
      }).ok,
    ).toBe(false));
  it("rejects zero sample sizes", () =>
    expect(
      runSpeciesAccumulationRarefied({
        sampleInt: 0,
        speciesTotalInt: 20,
        totalIndividualsInt: 100,
      }).ok,
    ).toBe(false));
});
