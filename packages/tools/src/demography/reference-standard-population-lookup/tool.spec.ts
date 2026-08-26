import { describe, expect, it } from "vitest";
import {
  calculateReferenceStandardPopulationLookup,
  runReferenceStandardPopulationLookup,
  referenceStandardPopulationLookupExample,
} from "./tool.js";

describe("demography/reference-standard-population-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReferenceStandardPopulationLookup(
        referenceStandardPopulationLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: referenceStandardPopulationLookupExample.output,
    });
  });

  it("labels every documented standard", () => {
    const entries = (["european", "whoWorld2000", "us2000"] as const).map(
      (standard) => calculateReferenceStandardPopulationLookup({ standard }),
    );
    expect(entries.map((entry) => entry.fullName)).toEqual([
      "European standard population",
      "WHO world standard population",
      "US 2000 standard population",
    ]);
  });

  it("rejects unknown standards", () => {
    expect(
      runReferenceStandardPopulationLookup({ standard: "african" as never }).ok,
    ).toBe(false);
  });
});
