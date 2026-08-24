import { describe, expect, it } from "vitest";
import {
  calculateFuelSurchargePercentAddOn,
  fuelSurchargePercentAddOnExample,
  runFuelSurchargePercentAddOn,
} from "./tool.js";

describe("fuel-surcharge-percent-add-on", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFuelSurchargePercentAddOn(fuelSurchargePercentAddOnExample.input),
    ).toEqual({
      ok: true,
      output: fuelSurchargePercentAddOnExample.output,
    });
  });

  it("adds nothing when the surcharge is zero percent", () => {
    expect(
      runFuelSurchargePercentAddOn({
        baseChargeUsd: 250.75,
        fuelSurchargePercent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { surchargeAmountUsd: 0, totalChargeUsd: 250.75 },
    });
  });

  it("reports invalid public percentages on the correct field", () => {
    const result = runFuelSurchargePercentAddOn({
      baseChargeUsd: 100,
      fuelSurchargePercent: -1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "fuelSurchargePercent",
    });
  });

  it("rejects non-finite inputs and unrepresentable totals", () => {
    expect(() =>
      calculateFuelSurchargePercentAddOn({
        baseChargeUsd: Number.POSITIVE_INFINITY,
        fuelSurchargePercent: 10,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateFuelSurchargePercentAddOn({
        baseChargeUsd: Number.MAX_VALUE,
        fuelSurchargePercent: 100,
      }),
    ).toThrow("total charge is outside");
  });
});
