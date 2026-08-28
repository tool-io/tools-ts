import { describe, expect, it } from "vitest";
import {
  ringOscillatorFrequencyExample,
  runRingOscillatorFrequency,
} from "./tool.js";

describe("Ring Oscillator Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRingOscillatorFrequency(ringOscillatorFrequencyExample.input),
    ).toEqual({
      ok: true,
      output: ringOscillatorFrequencyExample.output,
    });
  });

  it("matches the four-stage 25 ps case at five gigahertz", () => {
    expect(runRingOscillatorFrequency({ delayPs: 25, stagesInt: 4 })).toEqual({
      ok: true,
      output: { ringFrequencyGhz: 5 },
    });
  });

  it("rejects odd stage counts with invalid_stages", () => {
    expect(
      runRingOscillatorFrequency({ delayPs: 10, stagesInt: 3 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_stages", field: "stagesInt" }] },
      ok: false,
    });
  });

  it("rejects stage counts below two through schema validation", () => {
    expect(runRingOscillatorFrequency({ delayPs: 10, stagesInt: 0 }).ok).toBe(
      false,
    );
  });

  it("rejects fractional stage counts through schema validation", () => {
    expect(runRingOscillatorFrequency({ delayPs: 10, stagesInt: 2.5 }).ok).toBe(
      false,
    );
  });

  it("rejects zero delay with invalid_delay", () => {
    expect(
      runRingOscillatorFrequency({ delayPs: 0, stagesInt: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_delay", field: "delayPs" }] },
      ok: false,
    });
  });

  it("requires both inputs", () => {
    expect(runRingOscillatorFrequency({ stagesInt: 2 }).ok).toBe(false);
  });
});
