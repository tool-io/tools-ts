import { describe, expect, it } from "vitest";
import { keelLiftExample, runKeelLift } from "./tool.js";

describe("Keel Lift Calculator", () => {
  it("calculates the canonical example with the default lift coefficient", () =>
    expect(runKeelLift(keelLiftExample.input)).toEqual({
      ok: true,
      output: keelLiftExample.output,
    }));
  it("doubles lift when speed doubles", () => {
    expect(runKeelLift({ boatSpeedMs: 1, keelAreaM2: 1 })).toEqual({
      ok: true,
      output: { keelLiftNewtons: 512.5 },
    });
    expect(runKeelLift({ boatSpeedMs: 2, keelAreaM2: 1 })).toEqual({
      ok: true,
      output: { keelLiftNewtons: 2050 },
    });
  });
  it("scales linearly with area and coefficient", () =>
    expect(
      runKeelLift({ boatSpeedMs: 2, keelAreaM2: 1.5, liftCoefficient: 0.8 }),
    ).toEqual({ ok: true, output: { keelLiftNewtons: 2460 } }));
  it("accepts fractional coefficients at the upper range", () =>
    expect(
      runKeelLift({ boatSpeedMs: 5, keelAreaM2: 3, liftCoefficient: 1.25 }),
    ).toEqual({ ok: true, output: { keelLiftNewtons: 48046.875 } }));
  it("returns zero lift at zero boat speed", () => {
    const result = runKeelLift({ boatSpeedMs: 0, keelAreaM2: 2 });
    expect(result).toEqual({ ok: true, output: { keelLiftNewtons: 0 } });
  });
  it("returns zero lift with zero keel area", () => {
    const result = runKeelLift({ boatSpeedMs: 4, keelAreaM2: 0 });
    expect(result).toEqual({ ok: true, output: { keelLiftNewtons: 0 } });
  });
  it("rejects coefficients outside zero to two", () => {
    expect(
      runKeelLift({ boatSpeedMs: 4, keelAreaM2: 2, liftCoefficient: -0.1 }).ok,
    ).toBe(false);
    expect(
      runKeelLift({ boatSpeedMs: 4, keelAreaM2: 2, liftCoefficient: 2.5 }).ok,
    ).toBe(false);
  });
  it("rejects negative speeds and malformed input", () => {
    expect(runKeelLift({ boatSpeedMs: -3, keelAreaM2: 2 }).ok).toBe(false);
    expect(runKeelLift(null).ok).toBe(false);
    expect(runKeelLift({}).ok).toBe(false);
    expect(runKeelLift({ boatSpeedMs: "4", keelAreaM2: 2 }).ok).toBe(false);
  });
});
