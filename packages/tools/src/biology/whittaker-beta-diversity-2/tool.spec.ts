import { describe, expect, it } from "vitest";
import {
  runWhittakerBetaPairwise,
  whittakerBetaPairwiseExample,
} from "./tool.js";

describe("Whittaker Beta Pairwise", () => {
  it("publishes an executable example", () =>
    expect(
      runWhittakerBetaPairwise(whittakerBetaPairwiseExample.input),
    ).toEqual({
      ok: true,
      output: whittakerBetaPairwiseExample.output,
    }));
  it("divides mean site richness by the shared count", () =>
    expect(
      runWhittakerBetaPairwise({
        sharedSpeciesInt: 5,
        speciesSiteAInt: 12,
        speciesSiteBInt: 8,
      }),
    ).toEqual({ ok: true, output: { pairwiseWhittakerBeta: 2 } }));
  it("returns one for identical richness and full sharing", () =>
    expect(
      runWhittakerBetaPairwise({
        sharedSpeciesInt: 10,
        speciesSiteAInt: 10,
        speciesSiteBInt: 10,
      }),
    ).toEqual({ ok: true, output: { pairwiseWhittakerBeta: 1 } }));
  it("yields fractional beta for asymmetric sharing", () =>
    expect(
      runWhittakerBetaPairwise({
        sharedSpeciesInt: 3,
        speciesSiteAInt: 9,
        speciesSiteBInt: 7,
      }),
    ).toEqual({
      ok: true,
      output: { pairwiseWhittakerBeta: 2.6666666666666665 },
    }));
  it("rises as the shared count shrinks", () => {
    const wide = runWhittakerBetaPairwise({
      sharedSpeciesInt: 1,
      speciesSiteAInt: 6,
      speciesSiteBInt: 4,
    });
    const narrow = runWhittakerBetaPairwise({
      sharedSpeciesInt: 5,
      speciesSiteAInt: 6,
      speciesSiteBInt: 4,
    });
    if (!wide.ok || !narrow.ok) throw new Error("expected success");
    expect(wide.output.pairwiseWhittakerBeta as number).toBeGreaterThan(
      narrow.output.pairwiseWhittakerBeta as number,
    );
  });
  it("rejects zero shared species with no_overlap", () => {
    const result = runWhittakerBetaPairwise({
      sharedSpeciesInt: 0,
      speciesSiteAInt: 5,
      speciesSiteBInt: 3,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("no_overlap");
  });
  it("rejects a site without species", () => {
    const result = runWhittakerBetaPairwise({
      sharedSpeciesInt: 1,
      speciesSiteAInt: 0,
      speciesSiteBInt: 3,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-integer counts", () => {
    const result = runWhittakerBetaPairwise({
      sharedSpeciesInt: 1.5,
      speciesSiteAInt: 5,
      speciesSiteBInt: 3,
    });
    expect(result.ok).toBe(false);
  });
});
