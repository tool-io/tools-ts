import { describe, expect, it } from "vitest";
import {
  gothicDoublestoreyRatioExample,
  runGothicDoublestoreyRatio,
} from "./tool.js";

describe("gothic-doublestorey-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGothicDoublestoreyRatio(gothicDoublestoreyRatioExample.input),
    ).toEqual({
      ok: true,
      output: gothicDoublestoreyRatioExample.output,
    });
  });

  it("reports parity for an even mix", () => {
    const result = runGothicDoublestoreyRatio({
      doubleStoreyACount: 6,
      singleStoreyACount: 6,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.doubleToSingleRatio as number).toBe(1);
    expect(result.output.doubleStoreyASharePct as number).toBeCloseTo(50);
  });

  it("rejects samples without any single-storey a", () => {
    expect(
      runGothicDoublestoreyRatio({
        doubleStoreyACount: 12,
        singleStoreyACount: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative glyph counts", () => {
    expect(
      runGothicDoublestoreyRatio({
        doubleStoreyACount: -1,
        singleStoreyACount: 2,
      }).ok,
    ).toBe(false);
  });
});
