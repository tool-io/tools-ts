import { describe, expect, it } from "vitest";
import { swellIndexExample, runSwellIndex } from "./tool.js";

describe("swell-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSwellIndex(swellIndexExample.input)).toEqual({
      ok: true,
      output: swellIndexExample.output,
    });
  });

  it("computes a representative free swell test", () => {
    const result = runSwellIndex({
      swelledVolumeInWaterMl: 18,
      keroseneVolumeMl: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.freeSwellIndexPercent as number).toBe(80);
  });

  it("rejects a zero kerosene volume", () => {
    expect(
      runSwellIndex({ swelledVolumeInWaterMl: 16, keroseneVolumeMl: 0 }).ok,
    ).toBe(false);
  });
});
