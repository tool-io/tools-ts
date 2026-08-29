import { describe, expect, it } from "vitest";
import { flowRateExample, runFlowRate } from "./tool.js";

describe("flow-rate converter", () => {
  it("reproduces its volumetric-flow example", () => {
    expect(runFlowRate(flowRateExample.input)).toEqual({
      ok: true,
      output: flowRateExample.output,
    });
  });

  it("converts pounds per second to kilograms per second", () => {
    expect(
      runFlowRate({
        fromUnit: "lb/s",
        quantity: "mass",
        toUnit: "kg/s",
        value: 1,
      }),
    ).toEqual({
      ok: true,
      output: { quantity: "mass", unit: "kg/s", value: 0.45359237 },
    });
  });

  it("rejects conversion between mass and volume flow", () => {
    const result = runFlowRate({
      fromUnit: "kg/s",
      quantity: "mass",
      toUnit: "L/s",
      value: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "flow_quantity_mismatch",
        field: "toUnit",
      });
  });
});
