import { describe, expect, it } from "vitest";
import {
  runSullivanMethodHleAbridged,
  sullivanMethodHleAbridgedExample,
} from "./tool.js";

describe("sullivan-method-hle-abridged", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSullivanMethodHleAbridged(sullivanMethodHleAbridgedExample.input),
    ).toEqual({
      ok: true,
      output: sullivanMethodHleAbridgedExample.output,
    });
  });

  it("matches total life expectancy when nobody is disabled", () => {
    const r = runSullivanMethodHleAbridged({
      survivorsAtIntervalStarts: [100000, 80000],
      personYearsLived: [500000, 3000000],
      disabilityPrevalence: [0, 0],
    });
    expect(r.ok && r.output.lifeExpectancyByInterval).toEqual([35, 37.5]);
    expect(r.ok && r.output.healthyLifeExpectancyByInterval).toEqual([
      35, 37.5,
    ]);
  });

  it("rejects prevalence outside the unit interval", () => {
    expect(
      runSullivanMethodHleAbridged({
        survivorsAtIntervalStarts: [100000],
        personYearsLived: [5000000],
        disabilityPrevalence: [1.2],
      }).ok,
    ).toBe(false);
  });
});
