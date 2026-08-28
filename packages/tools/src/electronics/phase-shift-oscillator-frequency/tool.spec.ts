import { describe, expect, it } from "vitest";
import {
  phaseShiftOscillatorFrequencyExample,
  runPhaseShiftOscillatorFrequency,
} from "./tool.js";

describe("Phase Shift Oscillator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhaseShiftOscillatorFrequency(
        phaseShiftOscillatorFrequencyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: phaseShiftOscillatorFrequencyExample.output,
    });
  });

  it("doubles frequency when capacitance halves", () => {
    expect(
      runPhaseShiftOscillatorFrequency({ cFarads: 5e-9, rOhms: 10000 }),
    ).toEqual({
      ok: true,
      output: { oscillationFrequencyHz: 1299.4946687227937 },
    });
  });

  it("depends only on the RC product for equal products", () => {
    const result = runPhaseShiftOscillatorFrequency({
      cFarads: 1e-7,
      rOhms: 1000,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.oscillationFrequencyHz).toBeCloseTo(
        649.7473343613968,
        6,
      );
  });

  it("rejects zero resistance", () => {
    expect(
      runPhaseShiftOscillatorFrequency({ cFarads: 1e-8, rOhms: 0 }).ok,
    ).toBe(false);
  });

  it("rejects negative capacitance", () => {
    expect(
      runPhaseShiftOscillatorFrequency({ cFarads: -1e-8, rOhms: 10000 }).ok,
    ).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runPhaseShiftOscillatorFrequency({ rOhms: 10000 }).ok).toBe(false);
  });
});
