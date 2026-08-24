import { describe, expect, it } from "vitest";
import {
  longsRatioCalculatorExample,
  runLongsRatioCalculator,
} from "./tool.js";

describe("longs-ratio-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLongsRatioCalculator(longsRatioCalculatorExample.input)).toEqual({
      ok: true,
      output: longsRatioCalculatorExample.output,
    });
  });

  it("reports a full long-s share for pure long-s text", () => {
    const result = runLongsRatioCalculator({ text: "ſſſ" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.longSPercentageOfS as number).toBe(100);
    expect(result.output.roundSCount as number).toBe(0);
  });

  it("rejects text without any s glyph", () => {
    expect(runLongsRatioCalculator({ text: "abc" }).ok).toBe(false);
  });

  it("counts Unicode code points rather than UTF-16 code units", () => {
    const result = runLongsRatioCalculator({ text: "ſ😀" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.longSPerThousandCharacters).toBe(500);
  });
});
