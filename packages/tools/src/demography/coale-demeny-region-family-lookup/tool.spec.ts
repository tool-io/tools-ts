import { describe, expect, it } from "vitest";
import {
  calculateCoaleDemenyRegionFamilyLookup,
  runCoaleDemenyRegionFamilyLookup,
  coaleDemenyRegionFamilyLookupExample,
} from "./tool.js";

describe("demography/coale-demeny-region-family-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCoaleDemenyRegionFamilyLookup(
        coaleDemenyRegionFamilyLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: coaleDemenyRegionFamilyLookupExample.output,
    });
  });

  it("labels every regional family", () => {
    const families = (["north", "east", "south"] as const).map((family) =>
      calculateCoaleDemenyRegionFamilyLookup({ family, level: 5 }),
    );
    expect(families.map((entry) => entry.patternCode)).toEqual(["N", "E", "S"]);
    expect(families[2]!.modelLabel).toBe("Coale-Demeny South Level 5");
  });

  it("rejects levels outside the published range", () => {
    expect(
      runCoaleDemenyRegionFamilyLookup({ family: "west", level: 0 }).ok,
    ).toBe(false);
    expect(
      runCoaleDemenyRegionFamilyLookup({ family: "west", level: 26 }).ok,
    ).toBe(false);
  });
});
