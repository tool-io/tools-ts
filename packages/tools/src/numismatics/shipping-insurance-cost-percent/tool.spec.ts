import { describe, expect, it } from "vitest";
import {
  calculateShippingInsuranceCostPercent,
  example,
  runShippingInsuranceCostPercent,
} from "./tool.js";

describe("numismatics/shipping-insurance-cost-percent", () => {
  it("calculates the published example", () => {
    expect(calculateShippingInsuranceCostPercent(example.input)).toEqual(
      example.output,
    );
    expect(runShippingInsuranceCostPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runShippingInsuranceCostPercent({
      ...example.input,
      insuranceCost: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runShippingInsuranceCostPercent({ ...example.input, insuredValue: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "insuredValue" }] },
    });
  });
});
