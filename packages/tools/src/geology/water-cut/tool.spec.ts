import { describe, expect, it } from "vitest";
import { runWaterCut, waterCutExample } from "./tool.js";

describe("water-cut", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWaterCut(waterCutExample.input)).toEqual({
      ok: true,
      output: waterCutExample.output,
    });
  });

  it("reports a full water cut for a pure-water producer", () => {
    const result = runWaterCut({
      waterFlowRateM3PerS: 5,
      oilFlowRateM3PerS: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterCutFraction as number).toBe(1);
    expect(result.output.waterCutPercent as number).toBe(100);
  });
  it("rejects an all-zero production mix", () => {
    expect(
      runWaterCut({ waterFlowRateM3PerS: 0, oilFlowRateM3PerS: 0 }).ok,
    ).toBe(false);
  });
});
