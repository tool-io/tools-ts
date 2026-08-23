import { describe, expect, it } from "vitest";
import { basicBlockFuelSumExample, runBasicBlockFuelSum } from "./tool.js";

describe("basic block fuel subtotal calculator", () => {
  it("reproduces its canonical example", () => {
    expect(runBasicBlockFuelSum(basicBlockFuelSumExample.input)).toEqual({
      ok: true,
      output: basicBlockFuelSumExample.output,
    });
  });
  it("allows zero-valued components", () => {
    expect(
      runBasicBlockFuelSum({
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        taxiFuelKg: 0,
        tripFuelKg: 0,
      }),
    ).toEqual({ ok: true, output: { blockFuelSubtotalKg: 0 } });
  });
  it("rejects negative components", () => {
    expect(
      runBasicBlockFuelSum({
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        taxiFuelKg: -1,
        tripFuelKg: 0,
      }).ok,
    ).toBe(false);
  });
});
