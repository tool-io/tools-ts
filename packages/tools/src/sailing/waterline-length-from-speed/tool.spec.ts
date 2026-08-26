import { describe, expect, it } from "vitest";
import {
  runWaterlineLengthFromSpeed,
  waterlineLengthFromSpeedExample,
} from "./tool.js";

describe("waterline length from speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWaterlineLengthFromSpeed(waterlineLengthFromSpeedExample.input),
    ).toEqual({
      ok: true,
      output: waterlineLengthFromSpeedExample.output,
    });
  });

  it("inverts the 1.34 hull speed coefficient", () => {
    const result = runWaterlineLengthFromSpeed({ speedKt: 8 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterlineLengthFeet).toBe(35.64268211182891);
  });

  it("returns one foot for a speed equal to the coefficient", () => {
    const result = runWaterlineLengthFromSpeed({ speedKt: 1.34 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterlineLengthFeet).toBe(1);
  });

  it("quadruples length when speed doubles", () => {
    const base = runWaterlineLengthFromSpeed({ speedKt: 4 });
    const doubled = runWaterlineLengthFromSpeed({ speedKt: 8 });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.waterlineLengthFeet).toBeCloseTo(
      4 * (base.output.waterlineLengthFeet as number),
      9,
    );
  });

  it("rejects zero and negative speeds with a stable code", () => {
    for (const speedKt of [0, -5])
      expect(runWaterlineLengthFromSpeed({ speedKt })).toMatchObject({
        error: { issues: [{ code: "invalid_input", field: "speedKt" }] },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runWaterlineLengthFromSpeed({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "speedKt" }] },
      ok: false,
    });
  });

  it("rejects non-finite speeds", () => {
    for (const speedKt of [Number.NaN, Number.POSITIVE_INFINITY])
      expect(runWaterlineLengthFromSpeed({ speedKt }).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runWaterlineLengthFromSpeed({ displacementTons: 8, speedKt: 6.7 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "displacementTons" }] },
      ok: false,
    });
  });
});
