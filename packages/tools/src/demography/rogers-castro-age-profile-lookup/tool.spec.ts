import { describe, expect, it } from "vitest";
import {
  calculateRogersCastroAgeProfileLookup,
  runRogersCastroAgeProfileLookup,
  rogersCastroAgeProfileLookupExample,
} from "./tool.js";

describe("demography/rogers-castro-age-profile-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRogersCastroAgeProfileLookup(
        rogersCastroAgeProfileLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: rogersCastroAgeProfileLookupExample.output,
    });
  });

  it("peaks at mu2 with value a1 e^(-alpha1 mu2) + a2 + a3", () => {
    expect(
      calculateRogersCastroAgeProfileLookup({
        ages: [25],
        a1: 0.02,
        alpha1: 0.1,
        a2: 0.002,
        a3: 0.01,
        alpha2: 0.3,
        mu2: 25,
      }).fittedRates[0],
    ).toBeCloseTo(0.02 * Math.exp(-2.5) + 0.012, 15);
  });

  it("rejects negative amplitudes or empty ages", () => {
    expect(
      runRogersCastroAgeProfileLookup({
        ages: [],
        a1: 0.02,
        alpha1: 0.1,
        a2: 0.002,
        a3: 0.01,
        alpha2: 0.3,
        mu2: 25,
      }).ok,
    ).toBe(false);
    expect(
      runRogersCastroAgeProfileLookup({
        ages: [20],
        a1: -0.02,
        alpha1: 0.1,
        a2: 0.002,
        a3: 0.01,
        alpha2: 0.3,
        mu2: 25,
      }).ok,
    ).toBe(false);
  });
});
