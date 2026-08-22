import { describe, expect, it } from "vitest";
import {
  calculateTakeoffGroundRoll,
  runTakeoffGroundRoll,
  takeoffGroundRollExample,
} from "./tool.js";

describe("takeoff ground roll calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTakeoffGroundRoll(takeoffGroundRollExample.input)).toEqual({
      ok: true,
      output: takeoffGroundRollExample.output,
    });
  });

  it("shortens with stronger acceleration", () => {
    const weak = calculateTakeoffGroundRoll({
      accelerationG: 0.1,
      liftoffSpeedKt: 55,
    }).groundRollM;
    const strong = calculateTakeoffGroundRoll({
      accelerationG: 0.3,
      liftoffSpeedKt: 55,
    }).groundRollM;
    expect(strong).toBeLessThan(weak);
  });

  it("rejects out-of-range acceleration through execution", () => {
    for (const g of [0, 2.5])
      expect(
        runTakeoffGroundRoll({ accelerationG: g, liftoffSpeedKt: 55 }).ok,
      ).toBe(false);
  });
});
