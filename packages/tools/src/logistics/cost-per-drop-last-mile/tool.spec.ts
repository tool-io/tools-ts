import { describe, expect, it } from "vitest";
import {
  calculateCostPerDropLastMile,
  costPerDropLastMileExample,
  runCostPerDropLastMile,
  type CostPerDropLastMileInput,
} from "./tool.js";

describe("logistics/cost-per-drop-last-mile", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCostPerDropLastMile(costPerDropLastMileExample.input)).toEqual({
      ok: true,
      output: costPerDropLastMileExample.output,
    });
  });

  it("computes an independently derived fractional cost per drop", () => {
    const result = runCostPerDropLastMile({
      completedDrops: 3,
      totalDeliveryCost: 1000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.costPerDrop).toBeCloseTo(1000 / 3, 12);
  });

  it("is unchanged when cost and completed drops scale together", () => {
    expect(
      calculateCostPerDropLastMile({
        completedDrops: 60,
        totalDeliveryCost: 1800,
      }),
    ).toEqual(
      calculateCostPerDropLastMile({
        completedDrops: 30,
        totalDeliveryCost: 900,
      }),
    );
  });

  it("returns zero when the total delivery cost is zero", () => {
    expect(
      calculateCostPerDropLastMile({
        completedDrops: 20,
        totalDeliveryCost: -0,
      }),
    ).toEqual({ costPerDrop: 0 });
  });

  it("reports the public zero-drop boundary on completedDrops", () => {
    const result = runCostPerDropLastMile({
      completedDrops: 0,
      totalDeliveryCost: 100,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "completedDrops",
    });
  });

  it("rejects invalid direct-call counts and costs", () => {
    const invalidInputs: readonly CostPerDropLastMileInput[] = [
      { completedDrops: 0, totalDeliveryCost: 100 },
      { completedDrops: 1.5, totalDeliveryCost: 100 },
      { completedDrops: Number.MAX_SAFE_INTEGER + 1, totalDeliveryCost: 100 },
      { completedDrops: Number.POSITIVE_INFINITY, totalDeliveryCost: 100 },
      { completedDrops: 1, totalDeliveryCost: -1 },
      { completedDrops: 1, totalDeliveryCost: Number.NaN },
      { completedDrops: 1, totalDeliveryCost: Number.POSITIVE_INFINITY },
    ];

    for (const input of invalidInputs)
      expect(() => calculateCostPerDropLastMile(input)).toThrow();
  });

  it("rejects non-finite public input through the declared schema", () => {
    const result = runCostPerDropLastMile({
      completedDrops: 10,
      totalDeliveryCost: Number.POSITIVE_INFINITY,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "totalDeliveryCost",
    });
  });

  it("reports an unrepresentable positive quotient instead of returning zero", () => {
    const result = runCostPerDropLastMile({
      completedDrops: 2,
      totalDeliveryCost: Number.MIN_VALUE,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "unrepresentable_cost",
      field: "totalDeliveryCost",
    });
  });
});
