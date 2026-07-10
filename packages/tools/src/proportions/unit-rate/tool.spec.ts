import { describe, expect, it } from "vitest";
import { runUnitRate } from "./tool.js";
describe("Unit Rate Calculator", () => {
  it("calculates a valid result", () => {
    expect(runUnitRate({ amount: 18, units: 6 })).toEqual({
      ok: true,
      output: { unitRate: 3 },
    });
  });
  it("rejects invalid input", () => expect(runUnitRate(null).ok).toBe(false));
});
