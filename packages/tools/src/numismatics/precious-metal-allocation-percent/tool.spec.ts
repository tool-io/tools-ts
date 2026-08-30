import { describe, expect, it } from "vitest";
import {
  calculatePreciousMetalAllocationPercent,
  example,
  runPreciousMetalAllocationPercent,
} from "./tool.js";

describe("numismatics/precious-metal-allocation-percent", () => {
  it("calculates the published example", () => {
    expect(calculatePreciousMetalAllocationPercent(example.input)).toEqual(
      example.output,
    );
    expect(runPreciousMetalAllocationPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runPreciousMetalAllocationPercent({
      ...example.input,
      metalHoldingValue: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runPreciousMetalAllocationPercent({
        ...example.input,
        totalPortfolioValue: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "totalPortfolioValue" }] },
    });
  });
  it("rejects an allocation above the portfolio total", () => {
    expect(
      runPreciousMetalAllocationPercent({
        ...example.input,
        metalHoldingValue: example.input.totalPortfolioValue + 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "metalHoldingValue" }] },
    });
  });
});
