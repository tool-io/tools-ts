import { describe, expect, it } from "vitest";
import {
  calculateInventoryTurnover,
  inventoryTurnoverExample,
  runInventoryTurnover,
} from "./tool.js";

describe("inventory turnover calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runInventoryTurnover(inventoryTurnoverExample.input)).toEqual({
      ok: true,
      output: inventoryTurnoverExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateInventoryTurnover({
        averageInventory: 25000,
        costOfGoodsSold: 100000,
      }),
    ).toEqual({ inventoryTurnover: 4 });
  });

  it("scales linearly in cost of goods sold", () => {
    const base = calculateInventoryTurnover({
      averageInventory: 37500,
      costOfGoodsSold: 60000,
    });
    const doubled = calculateInventoryTurnover({
      averageInventory: 37500,
      costOfGoodsSold: 120000,
    });
    expect(doubled.inventoryTurnover).toBeCloseTo(
      base.inventoryTurnover * 2,
      12,
    );
  });

  it("rejects a negative cost of goods sold in direct calls", () => {
    expect(() =>
      calculateInventoryTurnover({ costOfGoodsSold: -1, averageInventory: 10 }),
    ).toThrow();
  });

  it("rejects non-positive average inventory with a stable code", () => {
    expect(
      runInventoryTurnover({ averageInventory: 0, costOfGoodsSold: 60000 }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_average_inventory_required",
            field: "averageInventory",
          },
        ],
      },
      ok: false,
    });
  });
});
