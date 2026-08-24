import { describe, expect, it } from "vitest";
import {
  presentValueExample,
  calculatePresentValue,
  runPresentValue,
} from "./tool.js";

describe("finance/present-value", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPresentValue(presentValueExample.input)).toEqual({
      ok: true,
      output: presentValueExample.output,
    });
  });
  it("supports a negative discount rate above -100 percent per period", () => {
    expect(
      runPresentValue({ annualRatePercent: -1, futureValue: 100, years: 1 }),
    ).toEqual({ ok: true, output: { presentValueUsd: 100 / 0.99 } });
  });
  it("rejects invalid input (invalid_amount)", () => {
    expect(runPresentValue({ futureValue: -5 }).ok).toBe(false);
  });
});
