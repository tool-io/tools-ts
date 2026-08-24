import { describe, expect, it } from "vitest";
import {
  realRateOfReturnExample,
  calculateRealRateOfReturn,
  runRealRateOfReturn,
} from "./tool.js";

describe("finance/real-rate-of-return", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRealRateOfReturn(realRateOfReturnExample.input)).toEqual({
      ok: true,
      output: realRateOfReturnExample.output,
    });
  });
  it("rejects invalid input (invalid_rate)", () => {
    expect(
      runRealRateOfReturn({ nominalReturnPercent: -150, inflationPercent: 3 })
        .ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_rate)", () => {
    expect(
      runRealRateOfReturn({ nominalReturnPercent: 8, inflationPercent: -200 })
        .ok,
    ).toBe(false);
  });
});
