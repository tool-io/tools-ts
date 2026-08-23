import { describe, expect, it } from "vitest";
import {
  headwindCrosswindDecompositionExample,
  runHeadwindCrosswindDecomposition,
} from "./tool.js";

describe("wind decomposition calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHeadwindCrosswindDecomposition(
        headwindCrosswindDecompositionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: headwindCrosswindDecompositionExample.output,
    });
  });

  it("reports full tailwind at one hundred eighty degrees", () => {
    const result = runHeadwindCrosswindDecomposition({
      relativeAngleDeg: 180,
      windSpeedKt: 50,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.headwindComponentKt).toBe(-50);
    expect(result.output.crosswindComponentKt).toBeCloseTo(0, 9);
  });

  it("isolates pure crosswind at ninety degrees", () => {
    const result = runHeadwindCrosswindDecomposition({
      relativeAngleDeg: 90,
      windSpeedKt: 50,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.headwindComponentKt).toBeCloseTo(0, 9);
    expect(result.output.crosswindComponentKt).toBeCloseTo(50, 9);
  });

  it("preserves the total wind magnitude", () => {
    const result = runHeadwindCrosswindDecomposition({
      relativeAngleDeg: 215,
      windSpeedKt: 27,
    });
    if (!result.ok) throw new Error("expected success");
    const magnitude = Math.hypot(
      Number(result.output.headwindComponentKt),
      Number(result.output.crosswindComponentKt),
    );
    expect(magnitude).toBeCloseTo(27, 9);
  });

  it("accepts a full-circle angle of three hundred sixty degrees", () => {
    const result = runHeadwindCrosswindDecomposition({
      relativeAngleDeg: 360,
      windSpeedKt: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.headwindComponentKt).toBeCloseTo(40, 9);
  });

  it("rejects angles above three hundred sixty degrees through validation", () => {
    expect(
      runHeadwindCrosswindDecomposition({
        relativeAngleDeg: 360.5,
        windSpeedKt: 10,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative angles through validation", () => {
    expect(
      runHeadwindCrosswindDecomposition({
        relativeAngleDeg: -0.5,
        windSpeedKt: 10,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative wind speeds through validation", () => {
    expect(
      runHeadwindCrosswindDecomposition({
        relativeAngleDeg: 45,
        windSpeedKt: -3,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { relativeAngleDeg: Number.NaN, windSpeedKt: 10 },
      { relativeAngleDeg: 45, windSpeedKt: Number.POSITIVE_INFINITY },
    ])
      expect(runHeadwindCrosswindDecomposition(bad).ok).toBe(false);
  });
});
