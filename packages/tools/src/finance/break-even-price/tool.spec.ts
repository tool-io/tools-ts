import { describe, expect, it } from "vitest";
import { runBreakEvenPrice } from "./tool.js";

describe("Break-Even Price Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runBreakEvenPrice({
        fixedCosts: 5000,
        units: 250,
        variableCostPerUnit: 12,
      }),
    ).toEqual({
      ok: true,
      output: { breakEvenPrice: 32 },
    });
  });

  it("rejects non-positive unit counts through execution", () => {
    expect(
      runBreakEvenPrice({
        fixedCosts: 100,
        units: 0,
        variableCostPerUnit: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_units" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runBreakEvenPrice(null).ok).toBe(false));
});
