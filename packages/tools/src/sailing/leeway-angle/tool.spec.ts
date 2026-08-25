import { describe, expect, it } from "vitest";
import {
  calculateLeewayAngle,
  leewayAngleExample,
  runLeewayAngle,
} from "./tool.js";

describe("leeway angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLeewayAngle(leewayAngleExample.input)).toEqual({
      ok: true,
      output: leewayAngleExample.output,
    });
  });

  it("increases with heel and decreases with speed", () => {
    const more_heel = calculateLeewayAngle({
      boatSpeedKt: 6,
      heelDeg: 30,
    }).leewayDeg;
    const faster = calculateLeewayAngle({
      boatSpeedKt: 8,
      heelDeg: 20,
    }).leewayDeg;
    expect(more_heel).toBe(1.25);
    expect(faster).toBe(0.46875);
  });

  it("returns zero when heel or the empirical factor is zero", () => {
    expect(runLeewayAngle({ boatSpeedKt: 6, heelDeg: 0 })).toEqual({
      ok: true,
      output: { leewayDeg: 0 },
    });
    expect(runLeewayAngle({ boatSpeedKt: 6, heelDeg: 20, kFactor: 0 })).toEqual(
      {
        ok: true,
        output: { leewayDeg: 0 },
      },
    );
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { boatSpeedKt: 0, heelDeg: 20 },
      { boatSpeedKt: -1, heelDeg: 20 },
    ])
      expect(runLeewayAngle(bad).ok).toBe(false);
  });
});
