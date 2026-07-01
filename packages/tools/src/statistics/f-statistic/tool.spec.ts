import { describe, expect, it } from "vitest";
import { calculateFStatistic } from "./tool.js";
describe("F statistic", () => {
  it("calculates a variance ratio", () => expect(calculateFStatistic({ numeratorVariance: 12, denominatorVariance: 3 })).toEqual({ ok: true, output: { fStatistic: 4 } }));
  it("rejects a zero denominator", () => expect(calculateFStatistic({ numeratorVariance: 1, denominatorVariance: 0 }).ok).toBe(false));
});
