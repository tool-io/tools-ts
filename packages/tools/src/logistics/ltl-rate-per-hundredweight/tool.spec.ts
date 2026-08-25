import { describe, expect, it } from "vitest";
import {
  ltlRatePerHundredweightExample,
  runLtlRatePerHundredweight,
} from "./tool.js";

describe("ltl-rate-per-hundredweight", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLtlRatePerHundredweight(ltlRatePerHundredweightExample.input),
    ).toEqual({
      ok: true,
      output: ltlRatePerHundredweightExample.output,
    });
  });

  it("lifts the linehaul to the minimum charge when the rate yields less", () => {
    const result = runLtlRatePerHundredweight({
      rateUsdPerCwt: 20,
      chargeableWeightLb: 200,
      minimumChargeUsd: 95,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.linehaulChargeUsd as number).toBe(40);
    expect(result.output.linehaulAfterFloorUsd as number).toBe(95);
    expect(result.output.totalChargeUsd as number).toBe(95);
  });
  it("rejects non-positive rate", () => {
    expect(
      runLtlRatePerHundredweight({ rateUsdPerCwt: 0, chargeableWeightLb: 500 })
        .ok,
    ).toBe(false);
  });
});
