import { describe, expect, it } from "vitest";
import type { ToolResult } from "../../core/result.js";
import {
  calculateHbtBaseTransitTime,
  hbtBaseTransitTimeExample,
  runHbtBaseTransitTime,
} from "./tool.js";

const errorOf = <T>(result: ToolResult<T>) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the execution to fail.");
  return result.error;
};

describe("Base Transit Time Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHbtBaseTransitTime(hbtBaseTransitTimeExample.input)).toEqual({
      ok: true,
      output: hbtBaseTransitTimeExample.output,
    });
  });

  it("canonical example survives a JSON round trip", () => {
    const roundTrip = JSON.parse(
      JSON.stringify(hbtBaseTransitTimeExample),
    ) as typeof hbtBaseTransitTimeExample;
    expect(roundTrip).toEqual(hbtBaseTransitTimeExample);
  });

  it("gives five picoseconds for a 0.1 um base with D = 10 cm^2/s", () => {
    const transit = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 10,
      baseWidthUm: 0.1,
    }).transitTimePs;
    expect(transit).toBeCloseTo(5, 12);
    expect(transit / 1000).toBeCloseTo(0.005, 15);
  });

  it("includes the factor of two in tau = W^2/(2D)", () => {
    const withFactor = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 10,
      baseWidthUm: 1,
    }).transitTimePs;
    expect(withFactor).toBeCloseTo(500, 9);
  });

  it("scales with the square of the base width", () => {
    const thin = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 10,
      baseWidthUm: 0.2,
    }).transitTimePs;
    const thick = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 10,
      baseWidthUm: 0.4,
    }).transitTimePs;
    expect(thick / thin).toBeCloseTo(4, 9);
  });

  it("scales inversely with the diffusion coefficient", () => {
    const slow = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 5,
      baseWidthUm: 0.3,
    }).transitTimePs;
    const fast = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 20,
      baseWidthUm: 0.3,
    }).transitTimePs;
    expect(slow / fast).toBeCloseTo(4, 9);
  });

  it("halves when the diffusion coefficient doubles at fixed width", () => {
    const base = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 10,
      baseWidthUm: 0.5,
    }).transitTimePs;
    expect(base).toBeCloseTo(125, 9);
    const doubled = calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS: 20,
      baseWidthUm: 0.5,
    }).transitTimePs;
    expect(doubled).toBeCloseTo(62.5, 9);
  });

  it("rejects zero and negative base widths and diffusion coefficients", () => {
    for (const bad of [
      { baseDiffusionCoefficientCm2PerS: 10, baseWidthUm: 0 },
      { baseDiffusionCoefficientCm2PerS: -10, baseWidthUm: 0.5 },
      { baseDiffusionCoefficientCm2PerS: 0, baseWidthUm: 0.5 },
    ]) {
      const error = errorOf(runHbtBaseTransitTime(bad));
      expect(error.code).toBe("invalid_input");
      expect(error.issues[0].code).toBe("invalid_field");
    }
  });

  it("rejects NaN through validation", () => {
    const error = errorOf(
      runHbtBaseTransitTime({
        baseDiffusionCoefficientCm2PerS: Number.NaN,
        baseWidthUm: 0.5,
      }),
    );
    expect(error.issues[0].code).toBe("invalid_field");
  });

  it("rejects missing required inputs", () => {
    const error = errorOf(runHbtBaseTransitTime({ baseWidthUm: 0.5 }));
    expect(error.code).toBe("invalid_input");
    expect(error.issues[0].field).toBe("baseDiffusionCoefficientCm2PerS");
  });

  it("rejects unsupported input fields", () => {
    const error = errorOf(
      runHbtBaseTransitTime({
        baseDiffusionCoefficientCm2PerS: 10,
        baseWidthUm: 0.5,
        material: "SiGe",
      }),
    );
    expect(error.issues[0].code).toBe("unknown_field");
  });
});
