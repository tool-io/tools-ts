import { describe, expect, it } from "vitest";
import { runIonSelectiveElectrodePotential } from "./tool.js";
describe("ISE Potential", () => {
  it("calculates a valid result", () =>
    expect(
      runIonSelectiveElectrodePotential({
        concentrationM: 0.01,
        interceptMV: 100,
        slopeMV: -59.16,
      }),
    ).toEqual({
      ok: true,
      output: { electrodePotentialMV: 218.32 },
    }));
  it("rejects invalid input", () =>
    expect(
      runIonSelectiveElectrodePotential({
        concentrationM: 0,
        interceptMV: 100,
        slopeMV: -59.16,
      }).ok,
    ).toBe(false));
});
