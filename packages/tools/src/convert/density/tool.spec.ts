import { describe, expect, it } from "vitest";
import { convertDensity, densityExample, runDensity } from "./tool.js";

describe("Convert Density", () => {
  it("converts the canonical example", () =>
    expect(
      convertDensity(
        densityExample.input.value,
        densityExample.input.fromUnit,
        densityExample.input.toUnit,
      ),
    ).toBeCloseTo(densityExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertDensity(3, "kg/m3", "kg/m3")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertDensity(1, "unknown", "kg/m3")).toBeNull();
    expect(convertDensity(Number.NaN, "kg/m3", "kg/m3")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runDensity(densityExample.input)).toEqual({
      ok: true,
      output: densityExample.output,
    }));
});
