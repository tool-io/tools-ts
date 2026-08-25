import { describe, expect, it } from "vitest";
import {
  calculateShrinkagePercentInventoryLoss,
  shrinkagePercentInventoryLossExample,
  runShrinkagePercentInventoryLoss,
} from "./tool.js";

describe("shrinkage-percent-inventory-loss", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runShrinkagePercentInventoryLoss(
        shrinkagePercentInventoryLossExample.input,
      ),
    ).toEqual({
      ok: true,
      output: shrinkagePercentInventoryLossExample.output,
    });
  });

  it("reports negative loss for overages", () => {
    expect(
      runShrinkagePercentInventoryLoss({
        bookInventoryUnits: 200,
        physicalCountUnits: 202,
      }),
    ).toEqual({ ok: true, output: { shrinkagePercent: -1, unitsLost: -2 } });
  });

  it("rejects zero book inventory", () => {
    expect(
      runShrinkagePercentInventoryLoss({
        bookInventoryUnits: 0,
        physicalCountUnits: 5,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional and non-finite inventory counts", () => {
    expect(() =>
      calculateShrinkagePercentInventoryLoss({
        bookInventoryUnits: 10.5,
        physicalCountUnits: 10,
      }),
    ).toThrow("positive whole number");
    expect(() =>
      calculateShrinkagePercentInventoryLoss({
        bookInventoryUnits: 10,
        physicalCountUnits: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("non-negative whole number");
  });
});
