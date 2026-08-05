import { describe, expect, it } from "vitest";
import { convertAngle, angleExample, runAngle } from "./tool.js";

describe("Convert Angle", () => {
  it("converts the canonical example", () =>
    expect(
      convertAngle(
        angleExample.input.value,
        angleExample.input.fromUnit,
        angleExample.input.toUnit,
      ),
    ).toBeCloseTo(angleExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertAngle(3, "rad", "rad")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertAngle(1, "unknown", "rad")).toBeNull();
    expect(convertAngle(Number.NaN, "rad", "rad")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runAngle(angleExample.input)).toEqual({
      ok: true,
      output: angleExample.output,
    }));
});
