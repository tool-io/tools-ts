import { describe, expect, it } from "vitest";
import {
  calculateLifoReserve,
  lifoReserveExample,
  runLifoReserve,
} from "./tool.js";

describe("LIFO reserve disclosure", () => {
  it("executes its canonical example exactly", () => {
    expect(runLifoReserve(lifoReserveExample.input)).toEqual({
      ok: true,
      output: lifoReserveExample.output,
    });
  });

  it("decomposes the reserve into tax and after-tax parts that sum to the reserve", () => {
    const result = calculateLifoReserve({
      fifoInventory: 900000,
      incomeTaxRatePercent: 25,
      lifoInventory: 650000,
    });
    expect(result.lifoReserve).toBe(250000);
    expect(result.deferredTaxEffect).toBe(62500);
    expect(result.afterTaxLifoReserveEffect).toBe(187500);
    expect(result.deferredTaxEffect + result.afterTaxLifoReserveEffect).toBe(
      result.lifoReserve,
    );
  });

  it("reports a zero reserve without negative zero", () => {
    const result = calculateLifoReserve({
      fifoInventory: 300000,
      incomeTaxRatePercent: 21,
      lifoInventory: 300000,
    });
    expect(result.lifoReserve).toBe(0);
    expect(result.deferredTaxEffect).toBe(0);
    expect(result.afterTaxLifoReserveEffect).toBe(0);
  });

  it("reports a negative reserve when LIFO exceeds FIFO", () => {
    const result = calculateLifoReserve({
      fifoInventory: 200000,
      incomeTaxRatePercent: 0,
      lifoInventory: 250000,
    });
    expect(result.lifoReserve).toBe(-50000);
    expect(result.deferredTaxEffect).toBe(0);
    expect(result.afterTaxLifoReserveEffect).toBe(-50000);
  });

  it("rejects out-of-range tax rates at the schema boundary", () => {
    expect(
      runLifoReserve({
        fifoInventory: 500000,
        incomeTaxRatePercent: 101,
        lifoInventory: 380000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "incomeTaxRatePercent" }],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateLifoReserve({
        fifoInventory: -1,
        incomeTaxRatePercent: 21,
        lifoInventory: 380000,
      }),
    ).toThrow();
    expect(() =>
      calculateLifoReserve({
        fifoInventory: 500000,
        incomeTaxRatePercent: NaN,
        lifoInventory: 380000,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runLifoReserve({
        fifoInventory: 500000,
        incomeTaxRatePercent: 21,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "lifoInventory" }] },
    });
  });
});
