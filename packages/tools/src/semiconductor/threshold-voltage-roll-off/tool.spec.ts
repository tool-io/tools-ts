import { describe, expect, it } from "vitest";
import {
  runThresholdVoltageRollOff,
  thresholdVoltageRollOffExample,
} from "./tool.js";

describe("short-channel threshold-voltage roll-off", () => {
  it("reproduces the documented empirical example", () =>
    expect(
      runThresholdVoltageRollOff(thresholdVoltageRollOffExample.input),
    ).toEqual({ ok: true, output: thresholdVoltageRollOffExample.output }));
  it("uses inverse-square length scaling", () =>
    expect(
      runThresholdVoltageRollOff({
        channelLengthNm: 100,
        minimumChannelLengthNm: 25,
        rollOffCoefficient: 80,
      }),
    ).toEqual({ ok: true, output: { thresholdShiftMillivolts: -5 } }));
  it("rejects a negative coefficient", () =>
    expect(
      runThresholdVoltageRollOff({
        channelLengthNm: 100,
        minimumChannelLengthNm: 50,
        rollOffCoefficient: -1,
      }),
    ).toMatchObject({ ok: false }));
});
