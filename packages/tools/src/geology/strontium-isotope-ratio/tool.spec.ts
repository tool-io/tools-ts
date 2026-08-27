import { describe, expect, it } from "vitest";
import {
  runStrontiumIsotopeRatio,
  strontiumIsotopeRatioExample,
} from "./tool.js";

describe("strontium-isotope-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStrontiumIsotopeRatio(strontiumIsotopeRatioExample.input),
    ).toEqual({
      ok: true,
      output: strontiumIsotopeRatioExample.output,
    });
  });

  it("down-corrects a heavy 88Sr/86Sr measurement", () => {
    const result = runStrontiumIsotopeRatio({
      measured87Sr86Sr: 0.710248,
      measured88Sr86Sr: 8.4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.massBiasBeta as number).toBeCloseTo(
      -0.1285661229063205,
      15,
    );
    expect(result.output.corrected87Sr86Sr as number).toBeCloseTo(
      0.709193121152694,
      14,
    );
  });

  it("rejects non-positive ratios", () => {
    expect(
      runStrontiumIsotopeRatio({
        measured87Sr86Sr: 0.710248,
        measured88Sr86Sr: -1,
      }).ok,
    ).toBe(false);
  });
});
