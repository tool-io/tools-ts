import { describe, expect, it } from "vitest";
import {
  calculateDieRotationErrorDegrees,
  example,
  runDieRotationErrorDegrees,
} from "./tool.js";

describe("numismatics/die-rotation-error-degrees", () => {
  it("calculates the published example", () => {
    expect(calculateDieRotationErrorDegrees(example.input)).toEqual(
      example.output,
    );
    expect(runDieRotationErrorDegrees(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDieRotationErrorDegrees({
      ...example.input,
      observedRotationDegrees: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateDieRotationErrorDegrees({
        observedRotationDegrees: 350,
        expectedRotationDegrees: 0,
      }).angularErrorDegrees,
    ).toBe(10);
  });
});
