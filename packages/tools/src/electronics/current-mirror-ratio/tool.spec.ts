import { describe, expect, it } from "vitest";
import {
  calculateCurrentMirrorRatio,
  currentMirrorRatioExample,
  runCurrentMirrorRatio,
} from "./tool.js";

describe("Mirror Ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCurrentMirrorRatio(currentMirrorRatioExample.input)).toEqual({
      ok: true,
      output: currentMirrorRatioExample.output,
    });
  });

  it("defaults to unity when the area ratio is omitted", () => {
    expect(calculateCurrentMirrorRatio({}).currentMirrorRatio).toBe(1);
    expect(runCurrentMirrorRatio({})).toEqual({
      ok: true,
      output: { currentMirrorRatio: 1 },
    });
  });

  it("supports fractional area ratios", () => {
    expect(
      calculateCurrentMirrorRatio({ mirrorTransistorsAreaRatioNumber: 2.5 })
        .currentMirrorRatio,
    ).toBe(2.5);
  });

  it("mirrors large multi-emitter ratios", () => {
    expect(
      calculateCurrentMirrorRatio({ mirrorTransistorsAreaRatioNumber: 16 })
        .currentMirrorRatio,
    ).toBe(16);
  });

  it("rejects a non-positive area ratio", () => {
    expect(
      runCurrentMirrorRatio({ mirrorTransistorsAreaRatioNumber: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_area_ratio" }] },
      ok: false,
    });
  });

  it("rejects a negative area ratio", () => {
    expect(
      runCurrentMirrorRatio({ mirrorTransistorsAreaRatioNumber: -3 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_area_ratio" }] },
      ok: false,
    });
  });
});
