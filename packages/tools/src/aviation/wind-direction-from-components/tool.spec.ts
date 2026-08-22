import { describe, expect, it } from "vitest";
import {
  windDirectionFromComponentsExample,
  runWindDirectionFromComponents,
} from "./tool.js";

describe("wind direction from components calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWindDirectionFromComponents(windDirectionFromComponentsExample.input),
    ).toEqual({
      ok: true,
      output: windDirectionFromComponentsExample.output,
    });
  });

  it("reports a direct headwind as zero degrees relative", () => {
    expect(
      runWindDirectionFromComponents({
        crosswindComponent: 0,
        headwindComponent: 15,
      }),
    ).toEqual({
      ok: true,
      output: { windDirectionDeg: 0 },
    });
  });

  it("reports a direct tailwind as 180 degrees relative", () => {
    expect(
      runWindDirectionFromComponents({
        crosswindComponent: 0,
        headwindComponent: -15,
      }),
    ).toEqual({
      ok: true,
      output: { windDirectionDeg: 180 },
    });
  });

  it("reports a pure right crosswind as 90 degrees relative", () => {
    expect(
      runWindDirectionFromComponents({
        crosswindComponent: 12,
        headwindComponent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { windDirectionDeg: 90 },
    });
  });

  it("reports a pure left crosswind as 270 degrees relative", () => {
    expect(
      runWindDirectionFromComponents({
        crosswindComponent: -12,
        headwindComponent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { windDirectionDeg: 270 },
    });
  });

  it("wraps negative angles into the zero through 360 range", () => {
    expect(
      runWindDirectionFromComponents({
        crosswindComponent: -10,
        headwindComponent: -10,
      }),
    ).toEqual({
      ok: true,
      output: { windDirectionDeg: 225 },
    });
  });

  it("rejects components that are both zero", () => {
    const result = runWindDirectionFromComponents({
      crosswindComponent: 0,
      headwindComponent: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("zero_wind");
  });

  it("round-trips with the wind speed calculator", async () => {
    const { runWindSpeedFromComponents } =
      await import("../wind-speed-from-components/tool.js");
    const cases = [
      [30, 40],
      [-10, 5],
      [7, -24],
    ] as const;
    for (const [headwind, crosswind] of cases) {
      const speed = runWindSpeedFromComponents({
        crosswindComponent: crosswind,
        headwindComponent: headwind,
      });
      if (!speed.ok) throw new Error("expected success");
      const direction = runWindDirectionFromComponents({
        crosswindComponent: crosswind,
        headwindComponent: headwind,
      });
      if (!direction.ok) throw new Error("expected success");
      const angleDeg = Number(direction.output.windDirectionDeg);
      const magnitude = Number(speed.output.windSpeedKt);
      const backHeadwind = magnitude * Math.cos((angleDeg * Math.PI) / 180);
      const backCrosswind = magnitude * Math.sin((angleDeg * Math.PI) / 180);
      expect(backHeadwind).toBeCloseTo(headwind, 9);
      expect(backCrosswind).toBeCloseTo(crosswind, 9);
    }
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(
      runWindDirectionFromComponents({ crosswindComponent: 5 }),
    ).toMatchObject({ ok: false });
    expect(
      runWindDirectionFromComponents({
        crosswindComponent: "strong",
        headwindComponent: 5,
      }),
    ).toMatchObject({ ok: false });
  });
});
