import { describe, expect, it } from "vitest";
import {
  calculateCostPerUnitShippedAllocation,
  costPerUnitShippedAllocationExample,
  runCostPerUnitShippedAllocation,
} from "./tool.js";

describe("cost-per-unit-shipped-allocation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCostPerUnitShippedAllocation(
        costPerUnitShippedAllocationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: costPerUnitShippedAllocationExample.output,
    });
  });

  it("divides evenly when the unit count divides the cost", () => {
    const result = runCostPerUnitShippedAllocation({
      totalShipmentCostUsd: 600,
      unitsShipped: 24,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.costPerUnitUsd).toBe(25);
  });

  it("returns positive zero when the shipment cost is zero", () => {
    const output = calculateCostPerUnitShippedAllocation({
      totalShipmentCostUsd: -0,
      unitsShipped: 10,
    });
    expect(output).toEqual({ costPerUnitUsd: 0 });
    expect(Object.is(output.costPerUnitUsd, -0)).toBe(false);
  });

  it("reports zero public units precisely", () => {
    const result = runCostPerUnitShippedAllocation({
      totalShipmentCostUsd: 100,
      unitsShipped: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "unitsShipped",
    });
  });

  it("rejects invalid costs, fractional counts, and underflow", () => {
    expect(() =>
      calculateCostPerUnitShippedAllocation({
        totalShipmentCostUsd: Number.NaN,
        unitsShipped: 2,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateCostPerUnitShippedAllocation({
        totalShipmentCostUsd: 100,
        unitsShipped: 1.5,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateCostPerUnitShippedAllocation({
        totalShipmentCostUsd: Number.MIN_VALUE,
        unitsShipped: Number.MAX_SAFE_INTEGER,
      }),
    ).toThrow("too small to represent");
  });
});
