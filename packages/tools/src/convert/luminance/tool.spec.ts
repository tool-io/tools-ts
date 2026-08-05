import { describe, expect, it } from "vitest";
import { convertLuminance, luminanceExample, runLuminance } from "./tool.js";

describe("Convert Luminance", () => {
  it("converts the canonical example", () =>
    expect(
      convertLuminance(
        luminanceExample.input.value,
        luminanceExample.input.fromUnit,
        luminanceExample.input.toUnit,
      ),
    ).toBeCloseTo(luminanceExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertLuminance(3, "cd/m2", "cd/m2")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertLuminance(1, "unknown", "cd/m2")).toBeNull();
    expect(convertLuminance(Number.NaN, "cd/m2", "cd/m2")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runLuminance(luminanceExample.input)).toEqual({
      ok: true,
      output: luminanceExample.output,
    }));
});
