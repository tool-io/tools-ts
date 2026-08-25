import { describe, expect, it } from "vitest";
import {
  calculateLandedCostDutiesTaxesTotal,
  landedCostDutiesTaxesTotalExample,
  runLandedCostDutiesTaxesTotal,
} from "./tool.js";

describe("logistics/landed-cost-duties-taxes-total", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLandedCostDutiesTaxesTotal(landedCostDutiesTaxesTotalExample.input),
    ).toEqual({ ok: true, output: landedCostDutiesTaxesTotalExample.output });
  });

  it("defaults to CIF passthrough with no duties or taxes", () => {
    const result = runLandedCostDutiesTaxesTotal({ goodsValue: 500 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.landedCostTotal as number).toBe(500);
    expect(result.output.dutyAmount as number).toBe(0);
  });

  it("rejects negative goods values via schema validation", () => {
    expect(runLandedCostDutiesTaxesTotal({ goodsValue: -5 }).ok).toBe(false);
  });

  it("rejects arithmetic overflow in the direct calculator", () => {
    expect(() =>
      calculateLandedCostDutiesTaxesTotal({
        freightCost: Number.MAX_VALUE,
        goodsValue: Number.MAX_VALUE,
      }),
    ).toThrowError(
      "The landed-cost result is outside the representable range.",
    );
  });
});
