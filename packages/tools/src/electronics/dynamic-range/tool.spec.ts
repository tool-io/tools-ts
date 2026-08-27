import { describe, expect, it } from "vitest";
import { runDynamicRange } from "./tool.js";

describe("Dynamic Range dB", () => {
  it("calculates a valid result", () =>
    expect(runDynamicRange({ maxLevelDbm: 10, noiseFloorDbm: -110 })).toEqual({
      ok: true,
      output: { dynamicRangeDb: 120 },
    }));
  it("handles a zero maximum level", () =>
    expect(runDynamicRange({ maxLevelDbm: 0, noiseFloorDbm: -90 })).toEqual({
      ok: true,
      output: { dynamicRangeDb: 90 },
    }));
  it("returns zero for equal levels", () =>
    expect(runDynamicRange({ maxLevelDbm: -20, noiseFloorDbm: -20 })).toEqual({
      ok: true,
      output: { dynamicRangeDb: 0 },
    }));
  it("returns negative range when the floor exceeds the maximum", () =>
    expect(runDynamicRange({ maxLevelDbm: -30, noiseFloorDbm: -10 })).toEqual({
      ok: true,
      output: { dynamicRangeDb: -20 },
    }));
  it("rejects a non-finite maximum level", () =>
    expect(
      runDynamicRange({ maxLevelDbm: Number.NaN, noiseFloorDbm: -110 }).ok,
    ).toBe(false));
  it("rejects a non-finite noise floor", () =>
    expect(
      runDynamicRange({
        maxLevelDbm: 10,
        noiseFloorDbm: Number.NEGATIVE_INFINITY,
      }).ok,
    ).toBe(false));
});
