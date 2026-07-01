import { describe, expect, it } from "vitest";
import { calculateLogarithmicMean } from "./tool.js";
describe("logarithmic mean", () => {
  it("calculates unequal and equal values", () => { const result = calculateLogarithmicMean({ first: 1, second: Math.E }); expect(result.ok && result.output.logarithmicMean).toBeCloseTo(Math.E - 1); expect(calculateLogarithmicMean({ first: 4, second: 4 })).toEqual({ ok: true, output: { logarithmicMean: 4 } }); });
  it("rejects nonpositive values", () => expect(calculateLogarithmicMean({ first: 0, second: 2 }).ok).toBe(false));
});
