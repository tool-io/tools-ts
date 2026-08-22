import { describe, expect, it } from "vitest";
import {
  calculateTurnRadius,
  runTurnRadius,
  turnRadiusExample,
} from "./tool.js";

describe("turn radius calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const output = calculateTurnRadius(turnRadiusExample.input).radiusM;
    expect(output).toBeCloseTo(673.098552543, 9);
  });

  it("grows with speed squared and shrinks with bank", () => {
    const slow = calculateTurnRadius({
      bankAngleDeg: 30,
      trueAirspeedKt: 60,
    }).radiusM;
    const fast = calculateTurnRadius({
      bankAngleDeg: 30,
      trueAirspeedKt: 120,
    }).radiusM;
    expect(fast).toBeCloseTo(slow * 4, 6);
    const steeper = calculateTurnRadius({
      bankAngleDeg: 60,
      trueAirspeedKt: 120,
    }).radiusM;
    expect(steeper).toBeLessThan(fast);
  });

  it("rejects zero bank through execution", () => {
    expect(
      runTurnRadius({ bankAngleDeg: 0, trueAirspeedKt: 120 }),
    ).toMatchObject({
      error: { issues: [{ code: "undefined_turn_radius" }] },
      ok: false,
    });
  });
});
