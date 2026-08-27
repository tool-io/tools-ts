import { describe, expect, it } from "vitest";
import { earthPressureAtRestExample, runEarthPressureAtRest } from "./tool.js";

describe("earth-pressure-at-rest", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEarthPressureAtRest(earthPressureAtRestExample.input)).toEqual({
      ok: true,
      output: earthPressureAtRestExample.output,
    });
  });

  it("computes Jaky K0 for a silty sand", () => {
    const result = runEarthPressureAtRest({
      effectiveVerticalStressKpa: 150,
      frictionAngleDeg: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.koCoefficient as number).toBe(0.6579798566743313);
    expect(result.output.horizontalEffectiveStressKpa as number).toBe(
      98.6969785011497,
    );
  });

  it("rejects a non-positive vertical stress", () => {
    expect(
      runEarthPressureAtRest({
        effectiveVerticalStressKpa: 0,
        frictionAngleDeg: 30,
      }).ok,
    ).toBe(false);
  });
});
