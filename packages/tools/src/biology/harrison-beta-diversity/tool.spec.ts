import { describe, expect, it } from "vitest";
import {
  harrisonBetaDiversityExample,
  runHarrisonBetaDiversity,
} from "./tool.js";

describe("Harrison Beta", () => {
  it("publishes an executable example", () =>
    expect(
      runHarrisonBetaDiversity(harrisonBetaDiversityExample.input),
    ).toEqual({
      ok: true,
      output: harrisonBetaDiversityExample.output,
    }));
  it("returns zero turnover when both sites match exactly", () =>
    expect(
      runHarrisonBetaDiversity({
        sharedInt: 10,
        speciesAInt: 10,
        speciesBInt: 10,
      }),
    ).toEqual({ ok: true, output: { harrisonBeta: 0 } }));
  it("returns one for completely disjoint sites", () =>
    expect(
      runHarrisonBetaDiversity({
        sharedInt: 0,
        speciesAInt: 5,
        speciesBInt: 3,
      }),
    ).toEqual({ ok: true, output: { harrisonBeta: 1 } }));
  it("scales turnover with unshared richness", () =>
    expect(
      runHarrisonBetaDiversity({
        sharedInt: 1,
        speciesAInt: 4,
        speciesBInt: 3,
      }),
    ).toEqual({
      ok: true,
      output: { harrisonBeta: 0.7142857142857143 },
    }));
  it("rejects shared counts above either site", () => {
    const result = runHarrisonBetaDiversity({
      sharedInt: 6,
      speciesAInt: 5,
      speciesBInt: 3,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_sets");
  });
  it("rejects two empty sites with identical_sites", () => {
    const result = runHarrisonBetaDiversity({
      sharedInt: 0,
      speciesAInt: 0,
      speciesBInt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("identical_sites");
  });
  it("rejects negative counts", () => {
    const result = runHarrisonBetaDiversity({
      sharedInt: -1,
      speciesAInt: 5,
      speciesBInt: 3,
    });
    expect(result.ok).toBe(false);
  });
});
