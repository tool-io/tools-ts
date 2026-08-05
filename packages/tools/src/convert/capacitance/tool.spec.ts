import { describe, expect, it } from "vitest";
import {
  convertCapacitance,
  capacitanceExample,
  runCapacitance,
} from "./tool.js";

describe("Convert Capacitance", () => {
  it("converts the canonical example", () =>
    expect(
      convertCapacitance(
        capacitanceExample.input.value,
        capacitanceExample.input.fromUnit,
        capacitanceExample.input.toUnit,
      ),
    ).toBeCloseTo(capacitanceExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertCapacitance(3, "F", "F")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertCapacitance(1, "unknown", "F")).toBeNull();
    expect(convertCapacitance(Number.NaN, "F", "F")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runCapacitance(capacitanceExample.input)).toEqual({
      ok: true,
      output: capacitanceExample.output,
    }));
});
