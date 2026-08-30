import { describe, expect, it } from "vitest";
import {
  calculateMixedLotAverageMeltPerCoin,
  example,
  runMixedLotAverageMeltPerCoin,
} from "./tool.js";

describe("numismatics/mixed-lot-average-melt-per-coin", () => {
  it("calculates the published example", () => {
    expect(calculateMixedLotAverageMeltPerCoin(example.input)).toEqual(
      example.output,
    );
    expect(runMixedLotAverageMeltPerCoin(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runMixedLotAverageMeltPerCoin({
      ...example.input,
      totalMeltValue: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runMixedLotAverageMeltPerCoin({ ...example.input, coinCount: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "coinCount" }] },
    });
  });
});
