import { describe, expect, it } from "vitest";
import {
  calculateAverageCostBasisCalculator,
  example,
  runAverageCostBasisCalculator,
} from "./tool.js";

describe("numismatics/average-cost-basis-calculator", () => {
  it("calculates the published example", () => {
    expect(calculateAverageCostBasisCalculator(example.input)).toEqual(
      example.output,
    );
    expect(runAverageCostBasisCalculator(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAverageCostBasisCalculator({
      ...example.input,
      totalAcquisitionCost: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runAverageCostBasisCalculator({ ...example.input, coinCount: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "coinCount" }] },
    });
  });
});
