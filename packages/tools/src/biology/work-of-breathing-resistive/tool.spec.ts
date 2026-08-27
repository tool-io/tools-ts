import { describe, expect, it } from "vitest";
import {
  runWorkOfBreathingResistive,
  workOfBreathingResistiveExample,
} from "./tool.js";

describe("Resistive WOB", () => {
  it("publishes an executable example", () =>
    expect(
      runWorkOfBreathingResistive(workOfBreathingResistiveExample.input),
    ).toEqual({ ok: true, output: workOfBreathingResistiveExample.output }));
  it("doubles when resistance doubles", () =>
    expect(
      runWorkOfBreathingResistive({
        inspiratoryFlowLs: 1,
        resistanceCmh2oLs: 10,
        tidalVolumeLiters: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { resistiveWorkJoules: 0.49050000000000005 },
    }));
  it("doubles when flow doubles at fixed volume", () =>
    expect(
      runWorkOfBreathingResistive({
        inspiratoryFlowLs: 2,
        resistanceCmh2oLs: 5,
        tidalVolumeLiters: 0.25,
      }),
    ).toEqual({
      ok: true,
      output: { resistiveWorkJoules: 0.24525000000000002 },
    }));
  it("keeps small fractional results", () =>
    expect(
      runWorkOfBreathingResistive({
        inspiratoryFlowLs: 0.5,
        resistanceCmh2oLs: 4,
        tidalVolumeLiters: 0.3,
      }),
    ).toEqual({ ok: true, output: { resistiveWorkJoules: 0.05886 } }));
  it("rejects zero resistance", () =>
    expect(
      runWorkOfBreathingResistive({
        inspiratoryFlowLs: 1,
        resistanceCmh2oLs: 0,
        tidalVolumeLiters: 0.5,
      }).ok,
    ).toBe(false));
  it("rejects zero flow", () =>
    expect(
      runWorkOfBreathingResistive({
        inspiratoryFlowLs: 0,
        resistanceCmh2oLs: 5,
        tidalVolumeLiters: 0.5,
      }).ok,
    ).toBe(false));
  it("rejects zero volume", () =>
    expect(
      runWorkOfBreathingResistive({
        inspiratoryFlowLs: 1,
        resistanceCmh2oLs: 5,
        tidalVolumeLiters: 0,
      }).ok,
    ).toBe(false));
});
