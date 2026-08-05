import { describe, expect, it } from "vitest";
import {
  convertElectricPotential,
  electricPotentialExample,
  runElectricPotential,
} from "./tool.js";

describe("Convert Electric Potential", () => {
  it("converts the canonical example", () =>
    expect(
      convertElectricPotential(
        electricPotentialExample.input.value,
        electricPotentialExample.input.fromUnit,
        electricPotentialExample.input.toUnit,
      ),
    ).toBeCloseTo(electricPotentialExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertElectricPotential(3, "V", "V")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertElectricPotential(1, "unknown", "V")).toBeNull();
    expect(convertElectricPotential(Number.NaN, "V", "V")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runElectricPotential(electricPotentialExample.input)).toEqual({
      ok: true,
      output: electricPotentialExample.output,
    }));
});
