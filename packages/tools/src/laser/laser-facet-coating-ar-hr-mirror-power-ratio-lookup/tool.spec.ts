import { describe, expect, it } from "vitest";
import {
  facetCoatingSplitExample as example,
  runFacetCoatingSplit,
} from "./tool.js";
describe("facet coating power split", () => {
  it("normalizes output coupling across both facets", () =>
    expect(runFacetCoatingSplit(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects two perfectly reflecting facets", () =>
    expect(
      runFacetCoatingSplit({
        frontReflectivityPercent: 100,
        mode: "coatings",
        rearReflectivityPercent: 100,
      }),
    ).toMatchObject({ ok: false }));
});
