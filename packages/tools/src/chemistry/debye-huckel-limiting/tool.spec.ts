import { describe, expect, it } from "vitest";
import { runDebyeHuckelLimiting, debyeHuckelLimitingExample } from "./tool.js";
describe("Debye-Huckel Limiting Law", () => {
  it("publishes an executable example", () =>
    expect(runDebyeHuckelLimiting(debyeHuckelLimitingExample.input)).toEqual({
      ok: true,
      output: debyeHuckelLimitingExample.output,
    }));
  it("gives a coefficient near zero point eight nine for monovalent ions", () =>
    expect(runDebyeHuckelLimiting({ charge: 1, ionicStrength: 0.01 })).toEqual({
      ok: true,
      output: { meanActivityCoefficient: 0.8894058875558918 },
    }));
  it("suppresses trivalent coefficients strongly", () =>
    expect(runDebyeHuckelLimiting({ charge: 3, ionicStrength: 0.01 })).toEqual({
      ok: true,
      output: { meanActivityCoefficient: 0.3482571166386542 },
    }));
  it("lowers the coefficient as ionic strength grows", () => {
    const dilute = runDebyeHuckelLimiting({ charge: 1, ionicStrength: 0.001 });
    const concentrated = runDebyeHuckelLimiting({
      charge: 1,
      ionicStrength: 0.01,
    });
    expect(dilute.ok).toBe(true);
    expect(concentrated.ok).toBe(true);
    if (dilute.ok && concentrated.ok)
      expect(Number(concentrated.output.meanActivityCoefficient)).toBeLessThan(
        Number(dilute.output.meanActivityCoefficient),
      );
  });
  it("keeps coefficients below one at positive ionic strength", () => {
    const result = runDebyeHuckelLimiting({ charge: 2, ionicStrength: 0.005 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(Number(result.output.meanActivityCoefficient)).toBeLessThan(1);
  });
  it("returns ideal behavior at zero ionic strength", () =>
    expect(runDebyeHuckelLimiting({ charge: 1, ionicStrength: 0 })).toEqual({
      ok: true,
      output: { meanActivityCoefficient: 1 },
    }));
  it("rejects ionic strength outside the limiting-law range", () =>
    expect(runDebyeHuckelLimiting({ charge: 1, ionicStrength: 0.02 }).ok).toBe(
      false,
    ));
  it("rejects negative ionic strength", () =>
    expect(runDebyeHuckelLimiting({ charge: 1, ionicStrength: -0.01 }).ok).toBe(
      false,
    ));
  it("rejects charges outside one to three", () =>
    expect(runDebyeHuckelLimiting({ charge: 4, ionicStrength: 0.01 }).ok).toBe(
      false,
    ));
});
