import { describe, expect, it } from "vitest";
import {
  runWhittakerBetaDiversity,
  whittakerBetaDiversityExample,
} from "./tool.js";

describe("Whittaker Beta Diversity", () => {
  it("publishes an executable example", () =>
    expect(
      runWhittakerBetaDiversity(whittakerBetaDiversityExample.input),
    ).toEqual({
      ok: true,
      output: whittakerBetaDiversityExample.output,
    }));
  it("is two for fully disjoint floras", () =>
    expect(
      runWhittakerBetaDiversity({
        sharedInt: 0,
        speciesAInt: 5,
        speciesBInt: 3,
      }),
    ).toEqual({ ok: true, output: { whittakerBeta: 2 } }));
  it("scales with partial overlap", () =>
    expect(
      runWhittakerBetaDiversity({
        sharedInt: 4,
        speciesAInt: 12,
        speciesBInt: 8,
      }),
    ).toEqual({
      ok: true,
      output: { whittakerBeta: 1.3333333333333333 },
    }));
  it("approaches one for identical floras", () =>
    expect(
      runWhittakerBetaDiversity({
        sharedInt: 6,
        speciesAInt: 6,
        speciesBInt: 6,
      }),
    ).toEqual({
      ok: true,
      output: { whittakerBeta: 0.6666666666666666 },
    }));
  it("rejects shared exceeding a site total", () => {
    const result = runWhittakerBetaDiversity({
      sharedInt: 6,
      speciesAInt: 5,
      speciesBInt: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_sets");
  });
  it("rejects negative shared counts", () =>
    expect(
      runWhittakerBetaDiversity({
        sharedInt: -1,
        speciesAInt: 5,
        speciesBInt: 5,
      }).ok,
    ).toBe(false));
  it("rejects fractional species counts", () =>
    expect(
      runWhittakerBetaDiversity({
        sharedInt: 1,
        speciesAInt: 5.5,
        speciesBInt: 5,
      }).ok,
    ).toBe(false));
});
