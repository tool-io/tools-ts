import { describe, expect, it } from "vitest";
import {
  calculateTrueWindAngle,
  runTrueWindAngle,
  trueWindAngleExample,
} from "./tool.js";

describe("true wind angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTrueWindAngle(trueWindAngleExample.input)).toEqual({
      ok: true,
      output: trueWindAngleExample.output,
    });
  });

  it("differs from AWA whenever the boat moves", () => {
    const r = runTrueWindAngle(trueWindAngleExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.trueWindAngleDeg).not.toBe(
      trueWindAngleExample.input.apparentWindAngleDeg,
    );
    expect(r.output.trueWindAngleDeg).toBeGreaterThan(0);
    expect(r.output.trueWindAngleDeg).toBeLessThanOrEqual(180);
  });

  it("collapses to AWA only when the boat is stationary", () => {
    const r = calculateTrueWindAngle({
      apparentWindAngleDeg: 40,
      apparentWindKt: 19,
      boatSpeedKt: 0,
    });
    expect(r.trueWindAngleDeg).toBe(40);
  });
});
