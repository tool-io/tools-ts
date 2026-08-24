import { describe, expect, it } from "vitest";
import {
  calculateChannelLengthModulation,
  channelLengthModulationExample,
  runChannelLengthModulation,
} from "./tool.js";

describe("Channel Length Modulation Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runChannelLengthModulation(channelLengthModulationExample.input),
    ).toEqual({
      ok: true,
      output: channelLengthModulationExample.output,
    });
  });

  it("uses lambda as the reciprocal of Early voltage", () => {
    expect(calculateChannelLengthModulation({ earlyVoltageV: 100 })).toEqual({
      lambdaPerV: 0.01,
    });
  });

  it("rejects non-positive Early voltage and unused fields", () => {
    expect(runChannelLengthModulation({ earlyVoltageV: 0 }).ok).toBe(false);
    expect(
      runChannelLengthModulation({ channelLengthUm: 1, earlyVoltageV: 50 }).ok,
    ).toBe(false);
  });
});
