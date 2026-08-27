import { describe, expect, it } from "vitest";
import { runWaterOilRatio, waterOilRatioExample } from "./tool.js";

describe("water-oil-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWaterOilRatio(waterOilRatioExample.input)).toEqual({
      ok: true,
      output: waterOilRatioExample.output,
    });
  });

  it("reports zero for a dry well", () => {
    const result = runWaterOilRatio({ waterVolumeSm3: 0, oilVolumeSm3: 40 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterOilRatio as number).toBe(0);
  });
  it("rejects non-positive oil volumes", () => {
    expect(runWaterOilRatio({ waterVolumeSm3: 5, oilVolumeSm3: -1 }).ok).toBe(
      false,
    );
  });
});
