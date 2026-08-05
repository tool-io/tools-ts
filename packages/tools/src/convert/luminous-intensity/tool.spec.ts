import { describe, expect, it } from "vitest";
import {
  convertLuminousIntensity,
  luminousIntensityExample,
  runLuminousIntensity,
} from "./tool.js";

describe("Convert Luminous Intensity", () => {
  it("converts the canonical example", () =>
    expect(
      convertLuminousIntensity(
        luminousIntensityExample.input.value,
        luminousIntensityExample.input.fromUnit,
        luminousIntensityExample.input.toUnit,
      ),
    ).toBeCloseTo(luminousIntensityExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertLuminousIntensity(3, "cd", "cd")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertLuminousIntensity(1, "unknown", "cd")).toBeNull();
    expect(convertLuminousIntensity(Number.NaN, "cd", "cd")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runLuminousIntensity(luminousIntensityExample.input)).toEqual({
      ok: true,
      output: luminousIntensityExample.output,
    }));
});
