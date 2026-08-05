import { describe, expect, it } from "vitest";
import {
  convertAngularVelocity,
  angularVelocityExample,
  runAngularVelocity,
} from "./tool.js";

describe("Convert Angular Velocity", () => {
  it("converts the canonical example", () =>
    expect(
      convertAngularVelocity(
        angularVelocityExample.input.value,
        angularVelocityExample.input.fromUnit,
        angularVelocityExample.input.toUnit,
      ),
    ).toBeCloseTo(angularVelocityExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertAngularVelocity(3, "rad/s", "rad/s")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertAngularVelocity(1, "unknown", "rad/s")).toBeNull();
    expect(convertAngularVelocity(Number.NaN, "rad/s", "rad/s")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runAngularVelocity(angularVelocityExample.input)).toEqual({
      ok: true,
      output: angularVelocityExample.output,
    }));
});
