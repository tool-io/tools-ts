import { describe, expect, it } from "vitest";
import {
  atterbergLiquidityIndexExample,
  runAtterbergLiquidityIndex,
} from "./tool.js";

describe("atterberg-liquidity-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAtterbergLiquidityIndex(atterbergLiquidityIndexExample.input),
    ).toEqual({
      ok: true,
      output: atterbergLiquidityIndexExample.output,
    });
  });

  it("returns one when water content equals the liquid limit", () => {
    const result = runAtterbergLiquidityIndex({
      waterContentPercent: 40,
      plasticLimitPercent: 21,
      plasticityIndexPercent: 19,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.liquidityIndex as number).toBe(1);
  });

  it("rejects a zero plasticity index", () => {
    expect(
      runAtterbergLiquidityIndex({
        waterContentPercent: 28,
        plasticLimitPercent: 21,
        plasticityIndexPercent: 0,
      }).ok,
    ).toBe(false);
  });
});
