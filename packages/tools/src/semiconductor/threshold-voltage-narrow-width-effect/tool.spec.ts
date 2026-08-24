import { describe, expect, it } from "vitest";
import {
  runThresholdVoltageNarrowWidthEffect,
  thresholdVoltageNarrowWidthEffectExample,
} from "./tool.js";

describe("narrow-width threshold shift", () => {
  it("reproduces the documented empirical example", () =>
    expect(
      runThresholdVoltageNarrowWidthEffect(
        thresholdVoltageNarrowWidthEffectExample.input,
      ),
    ).toEqual({
      ok: true,
      output: thresholdVoltageNarrowWidthEffectExample.output,
    }));
  it("scales inversely with channel width", () =>
    expect(
      runThresholdVoltageNarrowWidthEffect({
        channelWidthNm: 500,
        minimumChannelWidthNm: 100,
        narrowWidthCoefficient: 20,
      }),
    ).toEqual({ ok: true, output: { thresholdShiftMillivolts: 4 } }));
  it("requires a nonnegative calibrated coefficient", () =>
    expect(
      runThresholdVoltageNarrowWidthEffect({
        channelWidthNm: 500,
        minimumChannelWidthNm: 100,
        narrowWidthCoefficient: -1,
      }),
    ).toMatchObject({ ok: false }));
});
