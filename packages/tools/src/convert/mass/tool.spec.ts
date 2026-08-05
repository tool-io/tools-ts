import { describe, expect, it } from "vitest";
import { convertMass, massExample, runMass } from "./tool.js";

describe("Convert Mass", () => {
  it("converts the canonical example", () =>
    expect(
      convertMass(
        massExample.input.value,
        massExample.input.fromUnit,
        massExample.input.toUnit,
      ),
    ).toBeCloseTo(massExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertMass(3, "kg", "kg")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertMass(1, "unknown", "kg")).toBeNull();
    expect(convertMass(Number.NaN, "kg", "kg")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runMass(massExample.input)).toEqual({
      ok: true,
      output: massExample.output,
    }));
});
