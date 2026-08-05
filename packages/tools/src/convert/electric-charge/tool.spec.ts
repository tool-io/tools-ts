import { describe, expect, it } from "vitest";
import {
  convertElectricCharge,
  electricChargeExample,
  runElectricCharge,
} from "./tool.js";

describe("Convert Electric Charge", () => {
  it("converts the canonical example", () =>
    expect(
      convertElectricCharge(
        electricChargeExample.input.value,
        electricChargeExample.input.fromUnit,
        electricChargeExample.input.toUnit,
      ),
    ).toBeCloseTo(electricChargeExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertElectricCharge(3, "C", "C")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertElectricCharge(1, "unknown", "C")).toBeNull();
    expect(convertElectricCharge(Number.NaN, "C", "C")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runElectricCharge(electricChargeExample.input)).toEqual({
      ok: true,
      output: electricChargeExample.output,
    }));
});
