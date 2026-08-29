import { describe, expect, it } from "vitest";
import {
  calculateUnitsOfProductionRate,
  runUnitsOfProductionRate,
  unitsOfProductionRateExample,
} from "./tool.js";

describe("units-of-production depreciation rate", () => {
  it("executes its canonical example exactly", () => {
    expect(
      runUnitsOfProductionRate(unitsOfProductionRateExample.input),
    ).toEqual({
      ok: true,
      output: unitsOfProductionRateExample.output,
    });
  });

  it("computes the OpenStax known value", () => {
    expect(
      calculateUnitsOfProductionRate({
        cost: 50000,
        salvageValue: 2000,
        totalUnits: 960000,
      }),
    ).toEqual({ depreciableBase: 48000, ratePerUnit: 0.05 });
  });

  it("applies the rate consistently to period units", () => {
    const rate = calculateUnitsOfProductionRate({
      cost: 25000,
      salvageValue: 6000,
      totalUnits: 125000,
    });
    expect(rate.ratePerUnit).toBe(0.152);
    expect(rate.ratePerUnit * 26000).toBeCloseTo(3952, 9);
  });

  it("handles a zero salvage value and zero depreciable base", () => {
    expect(
      calculateUnitsOfProductionRate({
        cost: 10000,
        salvageValue: 0,
        totalUnits: 4000,
      }),
    ).toEqual({ depreciableBase: 10000, ratePerUnit: 2.5 });
    expect(
      calculateUnitsOfProductionRate({
        cost: 10000,
        salvageValue: 10000,
        totalUnits: 4000,
      }),
    ).toEqual({ depreciableBase: 0, ratePerUnit: 0 });
  });

  it("rejects salvage exceeding cost with a stable code", () => {
    expect(
      runUnitsOfProductionRate({
        cost: 1000,
        salvageValue: 2000,
        totalUnits: 100,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "salvage_exceeds_cost", field: "salvageValue" }],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateUnitsOfProductionRate({
        cost: 50000,
        salvageValue: 2000,
        totalUnits: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateUnitsOfProductionRate({
        cost: -50000,
        salvageValue: 2000,
        totalUnits: 960000,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runUnitsOfProductionRate({ salvageValue: 2000, totalUnits: 960000 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "cost" }] },
    });
  });
});
