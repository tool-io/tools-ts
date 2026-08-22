import { describe, expect, it } from "vitest";
import {
  windSpeedFromComponentsExample,
  runWindSpeedFromComponents,
} from "./tool.js";

describe("wind speed from components calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWindSpeedFromComponents(windSpeedFromComponentsExample.input),
    ).toEqual({
      ok: true,
      output: windSpeedFromComponentsExample.output,
    });
  });

  it("returns the headwind magnitude for pure headwinds and tailwinds", () => {
    expect(
      runWindSpeedFromComponents({
        crosswindComponent: 0,
        headwindComponent: 25,
      }),
    ).toEqual({
      ok: true,
      output: { windSpeedKt: 25 },
    });
    expect(
      runWindSpeedFromComponents({
        crosswindComponent: 0,
        headwindComponent: -25,
      }),
    ).toEqual({
      ok: true,
      output: { windSpeedKt: 25 },
    });
  });

  it("is sign independent for crosswinds", () => {
    const right = runWindSpeedFromComponents({
      crosswindComponent: 15,
      headwindComponent: 0,
    });
    const left = runWindSpeedFromComponents({
      crosswindComponent: -15,
      headwindComponent: 0,
    });
    expect(right).toEqual(left);
  });

  it("solves three-four-five component triangles", () => {
    expect(
      runWindSpeedFromComponents({
        crosswindComponent: -24,
        headwindComponent: -7,
      }),
    ).toEqual({
      ok: true,
      output: { windSpeedKt: 25 },
    });
  });

  it("never exceeds the sum of the component magnitudes", () => {
    const result = runWindSpeedFromComponents({
      crosswindComponent: 18,
      headwindComponent: 14,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.windSpeedKt).toBeLessThanOrEqual(32);
    expect(result.output.windSpeedKt).toBeCloseTo(Math.hypot(14, 18), 12);
  });

  it("rejects components that are both zero", () => {
    const result = runWindSpeedFromComponents({
      crosswindComponent: 0,
      headwindComponent: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("zero_wind");
  });

  it("round-trips with the wind direction calculator", async () => {
    const { runWindDirectionFromComponents } =
      await import("../wind-direction-from-components/tool.js");
    for (const [headwind, crosswind] of [
      [20, -21],
      [-9, 12],
      [8, 15],
    ]) {
      const direction = runWindDirectionFromComponents({
        crosswindComponent: crosswind,
        headwindComponent: headwind,
      });
      if (!direction.ok) throw new Error("expected success");
      const speed = runWindSpeedFromComponents({
        crosswindComponent: crosswind,
        headwindComponent: headwind,
      });
      if (!speed.ok) throw new Error("expected success");
      const backHeadwind =
        Number(speed.output.windSpeedKt) *
        Math.cos((Number(direction.output.windDirectionDeg) * Math.PI) / 180);
      expect(backHeadwind).toBeCloseTo(headwind, 9);
    }
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(runWindSpeedFromComponents({ headwindComponent: 5 })).toMatchObject({
      ok: false,
    });
    expect(
      runWindSpeedFromComponents({
        crosswindComponent: null,
        headwindComponent: 5,
      }),
    ).toMatchObject({ ok: false });
  });
});
