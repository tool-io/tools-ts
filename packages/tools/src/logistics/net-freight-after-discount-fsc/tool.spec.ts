import { describe, expect, it } from "vitest";
import {
  netFreightAfterDiscountFscExample,
  runNetFreightAfterDiscountFsc,
} from "./tool.js";

describe("net-freight-after-discount-fsc", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNetFreightAfterDiscountFsc(netFreightAfterDiscountFscExample.input),
    ).toEqual({
      ok: true,
      output: netFreightAfterDiscountFscExample.output,
    });
  });

  it("passes charges through unadjusted with zero percentages", () => {
    const result = runNetFreightAfterDiscountFsc({ linehaulChargeUsd: 750.25 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.discountedLinehaulUsd as number).toBe(750.25);
    expect(result.output.fuelSurchargeUsd as number).toBe(0);
    expect(result.output.netFreightUsd as number).toBe(750.25);
  });
  it("rejects discounts over one hundred percent", () => {
    expect(
      runNetFreightAfterDiscountFsc({
        linehaulChargeUsd: 100,
        discountPercent: 150,
      }).ok,
    ).toBe(false);
  });
});
