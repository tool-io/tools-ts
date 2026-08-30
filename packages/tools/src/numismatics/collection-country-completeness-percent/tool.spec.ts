import { describe, expect, it } from "vitest";
import {
  calculateCollectionCountryCompletenessPercent,
  example,
  runCollectionCountryCompletenessPercent,
} from "./tool.js";

describe("numismatics/collection-country-completeness-percent", () => {
  it("calculates the published example", () => {
    expect(
      calculateCollectionCountryCompletenessPercent(example.input),
    ).toEqual(example.output);
    expect(runCollectionCountryCompletenessPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runCollectionCountryCompletenessPercent({
      ...example.input,
      representedCountries: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      runCollectionCountryCompletenessPercent({
        representedCountries: 11,
        targetCountries: 10,
      }).ok,
    ).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runCollectionCountryCompletenessPercent({
        ...example.input,
        targetCountries: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "targetCountries" }] },
    });
  });
});
