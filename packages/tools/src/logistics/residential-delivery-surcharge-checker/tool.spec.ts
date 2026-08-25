import { describe, expect, it } from "vitest";
import {
  residentialDeliverySurchargeCheckerExample,
  runResidentialDeliverySurchargeChecker,
} from "./tool.js";

describe("residential-delivery-surcharge-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResidentialDeliverySurchargeChecker(
        residentialDeliverySurchargeCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: residentialDeliverySurchargeCheckerExample.output,
    });
  });

  it("skips the fee for commercial stops", () => {
    const result = runResidentialDeliverySurchargeChecker({
      deliveryLocationType: "commercial",
      residentialSurchargeUsd: 5.75,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.surchargeApplies).toBe(false);
    expect(result.output.estimatedFeeUsd as number).toBe(0);
  });
  it("rejects negative surcharges", () => {
    expect(
      runResidentialDeliverySurchargeChecker({
        deliveryLocationType: "residential",
        residentialSurchargeUsd: -2,
      }).ok,
    ).toBe(false);
  });
});
