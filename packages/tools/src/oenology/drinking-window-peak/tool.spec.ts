import { describe, expect, it } from "vitest";
import {
  drinkingWindowPeakExample,
  drinkingWindowPeakTool,
  runDrinkingWindowPeak,
} from "./tool.js";

describe("drinkingWindowPeakTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runDrinkingWindowPeak(drinkingWindowPeakExample.input)).toEqual({
      ok: true,
      output: drinkingWindowPeakExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(drinkingWindowPeakExample))).toEqual(
      drinkingWindowPeakExample,
    );
    expect(drinkingWindowPeakTool.contractVersion).toBe(1);
    expect(drinkingWindowPeakTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDrinkingWindowPeak(null).ok).toBe(false);
    expect(
      runDrinkingWindowPeak({
        ...drinkingWindowPeakExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
