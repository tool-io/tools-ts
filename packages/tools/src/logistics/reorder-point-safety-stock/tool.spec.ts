import { describe, expect, it } from "vitest";
import {
  reorderPointSafetyStockExample,
  runReorderPointSafetyStock,
} from "./tool.js";

describe("reorder-point-safety-stock", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReorderPointSafetyStock(reorderPointSafetyStockExample.input),
    ).toEqual({
      ok: true,
      output: reorderPointSafetyStockExample.output,
    });
  });

  it("uses the default 95 percent service level when z is omitted", () => {
    expect(
      runReorderPointSafetyStock({
        demandPerPeriod: 100,
        demandStdDevPerPeriod: 20,
        leadTimePeriods: 1,
      }),
    ).toEqual({
      ok: true,
      output: { reorderPointUnits: 132.9, safetyStockUnits: 32.9 },
    });
  });

  it("rejects zero lead time", () => {
    expect(
      runReorderPointSafetyStock({
        demandPerPeriod: 10,
        demandStdDevPerPeriod: 1,
        leadTimePeriods: 0,
      }).ok,
    ).toBe(false);
  });
});
