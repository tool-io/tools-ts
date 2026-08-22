import { describe, expect, it } from "vitest";
import {
  calculateLandingGroundRoll,
  landingGroundRollExample,
  runLandingGroundRoll,
} from "./tool.js";

describe("landing ground roll calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLandingGroundRoll(landingGroundRollExample.input)).toEqual({
      ok: true,
      output: landingGroundRollExample.output,
    });
  });

  it("lengthens with faster touchdown and shortens with harder braking", () => {
    const fast = calculateLandingGroundRoll({
      decelerationG: 0.25,
      touchdownSpeedKt: 60,
    }).groundRollM;
    const slow = calculateLandingGroundRoll({
      decelerationG: 0.25,
      touchdownSpeedKt: 50,
    }).groundRollM;
    expect(fast).toBeGreaterThan(slow);
    const hard = calculateLandingGroundRoll({
      decelerationG: 0.4,
      touchdownSpeedKt: 50,
    }).groundRollM;
    expect(hard).toBeLessThan(slow);
  });

  it("rejects out-of-range deceleration through execution", () => {
    for (const g of [0, 3])
      expect(
        runLandingGroundRoll({ decelerationG: g, touchdownSpeedKt: 50 }).ok,
      ).toBe(false);
  });
});
