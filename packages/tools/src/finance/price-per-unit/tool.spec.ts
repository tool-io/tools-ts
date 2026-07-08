import { describe, expect, it } from "vitest";
import { runPricePerUnit } from "./tool.js";
describe("Price per Unit Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPricePerUnit({ totalPrice: 12, quantity: 8 })).toEqual({
      ok: true,
      output: { pricePerUnit: 1.5 },
    });
  });
  it("rejects invalid input", () =>
    expect(runPricePerUnit(null).ok).toBe(false));
});
