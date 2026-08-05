import { describe, expect, it } from "vitest";
import {
  convertElectricCurrent,
  electricCurrentExample,
  runElectricCurrent,
} from "./tool.js";

describe("Convert Electric Current", () => {
  it("converts the canonical example", () =>
    expect(
      convertElectricCurrent(
        electricCurrentExample.input.value,
        electricCurrentExample.input.fromUnit,
        electricCurrentExample.input.toUnit,
      ),
    ).toBeCloseTo(electricCurrentExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertElectricCurrent(3, "A", "A")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertElectricCurrent(1, "unknown", "A")).toBeNull();
    expect(convertElectricCurrent(Number.NaN, "A", "A")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runElectricCurrent(electricCurrentExample.input)).toEqual({
      ok: true,
      output: electricCurrentExample.output,
    }));
});
