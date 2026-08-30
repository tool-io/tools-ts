import { describe, expect, it } from "vitest";
import {
  calculateCleanedCoinMarketHitPercent,
  example,
  runCleanedCoinMarketHitPercent,
} from "./tool.js";

describe("numismatics/cleaned-coin-market-hit-percent", () => {
  it("calculates the published example", () => {
    expect(calculateCleanedCoinMarketHitPercent(example.input)).toEqual(
      example.output,
    );
    expect(runCleanedCoinMarketHitPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runCleanedCoinMarketHitPercent({
      ...example.input,
      cleanedCoinPrice: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runCleanedCoinMarketHitPercent({
        ...example.input,
        originalCoinPrice: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "originalCoinPrice" }] },
    });
  });
  it("rejects a negative market-hit scenario", () => {
    expect(
      runCleanedCoinMarketHitPercent({
        ...example.input,
        cleanedCoinPrice: example.input.originalCoinPrice + 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "cleanedCoinPrice" }] },
    });
  });
});
