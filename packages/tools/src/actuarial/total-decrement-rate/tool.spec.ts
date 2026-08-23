import { describe, expect, it } from "vitest";
import {
  calculateTotalDecrementRate,
  runTotalDecrementRate,
  totalDecrementRateExample,
} from "./tool.js";

describe("total decrement rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTotalDecrementRate(totalDecrementRateExample.input)).toEqual({
      ok: true,
      output: totalDecrementRateExample.output,
    });
  });

  it("never exceeds one even for many causes", () => {
    expect(
      calculateTotalDecrementRate({
        independentDecrementRates: [0.5, 0.5, 0.5, 0.5],
      }).totalDecrementRate,
    ).toBe(0.9375);
  });

  it("rejects rates above one", () => {
    expect(runTotalDecrementRate({ independentDecrementRates: [1.5] }).ok).toBe(
      false,
    );
    expect(runTotalDecrementRate({}).ok).toBe(false);
  });
});
