import { describe, expect, it } from "vitest";
import {
  convertElectricConductance,
  electricConductanceExample,
  runElectricConductance,
} from "./tool.js";

describe("Convert Electric Conductance", () => {
  it("converts the canonical example", () =>
    expect(
      convertElectricConductance(
        electricConductanceExample.input.value,
        electricConductanceExample.input.fromUnit,
        electricConductanceExample.input.toUnit,
      ),
    ).toBeCloseTo(electricConductanceExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertElectricConductance(3, "S", "S")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertElectricConductance(1, "unknown", "S")).toBeNull();
    expect(convertElectricConductance(Number.NaN, "S", "S")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runElectricConductance(electricConductanceExample.input)).toEqual({
      ok: true,
      output: electricConductanceExample.output,
    }));
});
