import { describe, expect, it } from "vitest";
import { aceBiasCorrectedExample, runAceBiasCorrected } from "./tool.js";

describe("ACE Bias Corrected", () => {
  it("publishes an executable example", () =>
    expect(runAceBiasCorrected(aceBiasCorrectedExample.input)).toEqual({
      ok: true,
      output: aceBiasCorrectedExample.output,
    }));
  it("includes the rare-species heterogeneity correction", () => {
    const result = runAceBiasCorrected({
      frequencyMoment: 50,
      observedInt: 12,
      rareIndividualsInt: 20,
      rareSpeciesInt: 8,
      singletonInt: 4,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.biasCorrectedAce).toBeCloseTo(15.5789473684, 9);
  });
  it("returns the observed count without rare species", () =>
    expect(
      runAceBiasCorrected({
        frequencyMoment: 0,
        observedInt: 6,
        rareIndividualsInt: 0,
        rareSpeciesInt: 0,
        singletonInt: 0,
      }),
    ).toEqual({ ok: true, output: { biasCorrectedAce: 6 } }));
  it("rejects an empty community", () =>
    expect(
      runAceBiasCorrected({
        frequencyMoment: 0,
        observedInt: 0,
        rareIndividualsInt: 0,
        rareSpeciesInt: 0,
        singletonInt: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero rare-species coverage", () =>
    expect(
      runAceBiasCorrected({
        frequencyMoment: 0,
        observedInt: 4,
        rareIndividualsInt: 3,
        rareSpeciesInt: 3,
        singletonInt: 3,
      }).ok,
    ).toBe(false));
  it("rejects inconsistent rare-group counts", () =>
    expect(
      runAceBiasCorrected({
        frequencyMoment: 2,
        observedInt: 4,
        rareIndividualsInt: 2,
        rareSpeciesInt: 3,
        singletonInt: 1,
      }).ok,
    ).toBe(false));
});
