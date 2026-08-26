import { describe, expect, it } from "vitest";
import {
  calculatePrimaryInfecundityPercentLookup,
  runPrimaryInfecundityPercentLookup,
  primaryInfecundityPercentLookupExample,
} from "./tool.js";

describe("demography/primary-infecundity-percent-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPrimaryInfecundityPercentLookup(
        primaryInfecundityPercentLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: primaryInfecundityPercentLookupExample.output,
    });
  });

  it("bands percentages at the documented cut points", () => {
    expect(
      calculatePrimaryInfecundityPercentLookup({
        infecundWomen: 5,
        totalWomen: 100,
      }).level,
    ).toBe("moderate");
    expect(
      calculatePrimaryInfecundityPercentLookup({
        infecundWomen: 6,
        totalWomen: 100,
      }).level,
    ).toBe("elevated");
  });

  it("rejects inconsistent counts", () => {
    expect(
      runPrimaryInfecundityPercentLookup({ infecundWomen: 10, totalWomen: 5 })
        .ok,
    ).toBe(false);
    expect(
      runPrimaryInfecundityPercentLookup({ infecundWomen: 1, totalWomen: 0 })
        .ok,
    ).toBe(false);
  });
});
