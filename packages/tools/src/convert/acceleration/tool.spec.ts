import { describe, expect, it } from "vitest";
import {
  convertAcceleration,
  accelerationExample,
  runAcceleration,
} from "./tool.js";

describe("Convert Acceleration", () => {
  it("converts the canonical example", () =>
    expect(
      convertAcceleration(
        accelerationExample.input.value,
        accelerationExample.input.fromUnit,
        accelerationExample.input.toUnit,
      ),
    ).toBeCloseTo(accelerationExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertAcceleration(3, "m/s2", "m/s2")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertAcceleration(1, "unknown", "m/s2")).toBeNull();
    expect(convertAcceleration(Number.NaN, "m/s2", "m/s2")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runAcceleration(accelerationExample.input)).toEqual({
      ok: true,
      output: accelerationExample.output,
    }));
});
