import { describe, expect, it } from "vitest";
import {
  chaptalizationSugarExample,
  chaptalizationSugarTool,
  runChaptalizationSugar,
} from "./tool.js";

describe("chaptalizationSugarTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runChaptalizationSugar(chaptalizationSugarExample.input)).toEqual({
      ok: true,
      output: chaptalizationSugarExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(chaptalizationSugarExample))).toEqual(
      chaptalizationSugarExample,
    );
    expect(chaptalizationSugarTool.contractVersion).toBe(1);
    expect(chaptalizationSugarTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runChaptalizationSugar(null).ok).toBe(false);
    expect(
      runChaptalizationSugar({
        ...chaptalizationSugarExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("chaptalization sugar boundaries", () => {
  it("rejects targets the must already exceeds", () => {
    expect(
      runChaptalizationSugar({
        currentBrix: 20,
        targetPotentialAlcoholPercent: 10,
        volumeLiters: 100,
      }).ok,
    ).toBe(false);
  });

  it("scales the sugar need linearly with volume", () => {
    const result = runChaptalizationSugar({
      currentBrix: 18,
      targetPotentialAlcoholPercent: 13,
      volumeLiters: 200,
    });
    expect(result.ok && result.output.sugarKilograms).toBeCloseTo(8.0678, 3);
  });
});
