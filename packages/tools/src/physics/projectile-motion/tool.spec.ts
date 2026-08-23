import { describe, expect, it } from "vitest";
import {
  projectileMotionExample,
  calculateProjectileMotion,
  runProjectileMotion,
} from "./tool.js";

describe("physics/projectile-motion", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runProjectileMotion(projectileMotionExample.input)).toEqual({
      ok: true,
      output: projectileMotionExample.output,
    });
  });
  it("rejects invalid input (invalid_speed)", () => {
    expect(
      runProjectileMotion({ initialSpeed: -1, launchAngleDegrees: 45 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(
      runProjectileMotion({ initialSpeed: 20, launchAngleDegrees: 95 }).ok,
    ).toBe(false);
  });
  it("scales range with gravity", () => {
    const earth = runProjectileMotion({
      initialSpeed: 20,
      launchAngleDegrees: 45,
    });
    const moon = runProjectileMotion({
      initialSpeed: 20,
      launchAngleDegrees: 45,
      gravity: 1.62,
    });
    expect(earth.ok && moon.ok).toBe(true);
    if (earth.ok && moon.ok)
      expect(moon.output.rangeMeters as number as number).toBeGreaterThan(
        earth.output.rangeMeters as number,
      );
  });
});
