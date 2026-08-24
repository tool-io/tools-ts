import { describe, expect, it } from "vitest";
import {
  calculateWealthQuintileRatio,
  wealthQuintileRatioExample,
  wealthQuintileRatioTool,
  runWealthQuintileRatio,
} from "./tool.js";

describe("wealthQuintileRatioTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runWealthQuintileRatio(wealthQuintileRatioExample.input)).toEqual({
      ok: true,
      output: wealthQuintileRatioExample.output,
    });
  });

  it("compares equal-sized richest and poorest fifths", () => {
    expect(
      calculateWealthQuintileRatio({ wealthValues: [1, 2, 3, 4, 5] }),
    ).toEqual({ quintileRatio: 5 });
    const result = runWealthQuintileRatio({
      wealthValues: [-2, 1, 2, 3, 4],
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("wealthValues");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(wealthQuintileRatioExample))).toEqual(
      wealthQuintileRatioExample,
    );
    expect(wealthQuintileRatioTool.contractVersion).toBe(1);
    expect(wealthQuintileRatioTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runWealthQuintileRatio(null).ok).toBe(false);
    expect(
      runWealthQuintileRatio({
        ...wealthQuintileRatioExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
