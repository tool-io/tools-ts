import { describe, expect, it } from "vitest";
import { runCostPlusPrice } from "./tool.js";

describe("Cost Plus Price Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCostPlusPrice({ cost: 40, markupPercent: 50 })).toEqual({
      ok: true,
      output: { price: 60 },
    });
  });

  it("returns the cost unchanged for a zero markup", () => {
    expect(runCostPlusPrice({ cost: 25, markupPercent: 0 })).toEqual({
      ok: true,
      output: { price: 25 },
    });
  });

  it("rejects invalid input", () =>
    expect(runCostPlusPrice(null).ok).toBe(false));
});
