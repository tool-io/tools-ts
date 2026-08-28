import { describe, expect, it } from "vitest";
import { runIonicMobility } from "./tool.js";

describe("Ionic Mobility Calculator", () => {
  it("calculates a valid result", () => {
    const result = runIonicMobility({
      ionicConductivitySCm2Mol: 1,
      chargeZ: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.mobilityCm2Vs).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runIonicMobility(null).ok).toBe(false));
});
