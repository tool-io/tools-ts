import { describe, expect, it } from "vitest";
import {
  bankAngleFromLoadExample,
  calculateBankAngleFromLoad,
  runBankAngleFromLoad,
} from "./tool.js";

describe("bank angle from load factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBankAngleFromLoad(bankAngleFromLoadExample.input)).toEqual({
      ok: true,
      output: bankAngleFromLoadExample.output,
    });
  });

  it("is wings level at one g", () => {
    expect(calculateBankAngleFromLoad({ loadFactorG: 1 })).toEqual({
      bankAngleDeg: 0,
    });
  });

  it("rejects sub-one-g load factors through execution", () => {
    for (const g of [0.5, 0, -2])
      expect(runBankAngleFromLoad({ loadFactorG: g }).ok).toBe(false);
  });
});
