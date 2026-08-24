import { describe, expect, it } from "vitest";
import {
  calculateDaysOfSupplyTurnover,
  daysOfSupplyTurnoverExample,
  runDaysOfSupplyTurnover,
} from "./tool.js";

describe("days-of-supply-turnover", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDaysOfSupplyTurnover(daysOfSupplyTurnoverExample.input)).toEqual({
      ok: true,
      output: daysOfSupplyTurnoverExample.output,
    });
  });

  it("handles fast turning stock", () => {
    expect(
      runDaysOfSupplyTurnover({
        averageInventoryValueUsd: 100000,
        costOfGoodsSoldUsd: 3650000,
      }),
    ).toEqual({
      ok: true,
      output: { daysOfSupply: 10, inventoryTurnover: 36.5 },
    });
  });

  it("rejects zero average inventory", () => {
    const result = runDaysOfSupplyTurnover({
      averageInventoryValueUsd: 0,
      costOfGoodsSoldUsd: 100,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "averageInventoryValueUsd",
    });
  });

  it("requires finite positive annual COGS and representable results", () => {
    expect(() =>
      calculateDaysOfSupplyTurnover({
        averageInventoryValueUsd: 100,
        costOfGoodsSoldUsd: Number.NaN,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateDaysOfSupplyTurnover({
        averageInventoryValueUsd: Number.MAX_VALUE,
        costOfGoodsSoldUsd: Number.MIN_VALUE,
      }),
    ).toThrow("outside the representable range");
  });
});
