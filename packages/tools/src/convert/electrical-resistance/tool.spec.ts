import { describe, expect, it } from "vitest";
import {
  convertElectricalResistance,
  electricalResistanceExample,
  runElectricalResistance,
} from "./tool.js";

describe("Convert Electrical Resistance", () => {
  it("converts the canonical example", () =>
    expect(
      convertElectricalResistance(
        electricalResistanceExample.input.value,
        electricalResistanceExample.input.fromUnit,
        electricalResistanceExample.input.toUnit,
      ),
    ).toBeCloseTo(electricalResistanceExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertElectricalResistance(3, "ohm", "ohm")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertElectricalResistance(1, "unknown", "ohm")).toBeNull();
    expect(convertElectricalResistance(Number.NaN, "ohm", "ohm")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runElectricalResistance(electricalResistanceExample.input)).toEqual({
      ok: true,
      output: electricalResistanceExample.output,
    }));
});
