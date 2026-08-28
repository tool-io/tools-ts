import { describe, expect, it } from "vitest";
import { runPseudoFirstOrderRate } from "./tool.js";
describe("Pseudo First Order Rate", () => {
  it("calculates a valid result", () =>
    expect(
      runPseudoFirstOrderRate({
        excessReactantConcM: 0.4,
        rateConstantSecondOrder: 2.5,
      }),
    ).toEqual({
      ok: true,
      output: { observedRateConstant: 1 },
    }));
  it("rejects invalid input", () =>
    expect(
      runPseudoFirstOrderRate({
        excessReactantConcM: 0.4,
        rateConstantSecondOrder: 0,
      }).ok,
    ).toBe(false));
});
