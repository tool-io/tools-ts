import { describe, expect, it } from "vitest";
import {
  calculateAssetTurnover,
  assetTurnoverExample,
  runAssetTurnover,
} from "./tool.js";

describe("asset turnover calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAssetTurnover(assetTurnoverExample.input)).toEqual({
      ok: true,
      output: assetTurnoverExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateAssetTurnover({ netSales: 240000, averageTotalAssets: 300000 }),
    ).toEqual({ assetTurnover: 0.8 });
  });

  it("scales linearly in net sales", () => {
    const base = calculateAssetTurnover({
      netSales: 120000,
      averageTotalAssets: 225000,
    });
    const doubled = calculateAssetTurnover({
      netSales: 240000,
      averageTotalAssets: 225000,
    });
    expect(doubled.assetTurnover).toBeCloseTo(base.assetTurnover * 2, 12);
  });

  it("rejects a negative numerator in direct calls", () => {
    expect(() =>
      calculateAssetTurnover({ netSales: -1, averageTotalAssets: 10 }),
    ).toThrow();
  });

  it("rejects non-positive average assets with a stable code", () => {
    expect(
      runAssetTurnover({ netSales: 120000, averageTotalAssets: 0 }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_average_assets_required",
            field: "averageTotalAssets",
          },
        ],
      },
      ok: false,
    });
  });
});
