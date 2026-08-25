import { describe, expect, it } from "vitest";
import {
  alcoholAdjustWaterBlendExample,
  alcoholAdjustWaterBlendTool,
  runAlcoholAdjustWaterBlend,
} from "./tool.js";

describe("alcoholAdjustWaterBlendTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runAlcoholAdjustWaterBlend(alcoholAdjustWaterBlendExample.input),
    ).toEqual({
      ok: true,
      output: alcoholAdjustWaterBlendExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(alcoholAdjustWaterBlendExample))).toEqual(
      alcoholAdjustWaterBlendExample,
    );
    expect(alcoholAdjustWaterBlendTool.contractVersion).toBe(1);
    expect(alcoholAdjustWaterBlendTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runAlcoholAdjustWaterBlend(null).ok).toBe(false);
    expect(
      runAlcoholAdjustWaterBlend({
        ...alcoholAdjustWaterBlendExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects impossible alcohol percentages", () => {
    expect(
      runAlcoholAdjustWaterBlend({
        currentAbvPercent: 101,
        currentVolumeLiters: 100,
        targetAbvPercent: 12,
      }).ok,
    ).toBe(false);
  });
});
