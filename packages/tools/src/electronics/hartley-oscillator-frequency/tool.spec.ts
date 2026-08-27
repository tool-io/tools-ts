import { describe, expect, it } from "vitest";
import {
  hartleyOscillatorFrequencyExample,
  runHartleyOscillatorFrequency,
} from "./tool.js";

describe("Hartley Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHartleyOscillatorFrequency(hartleyOscillatorFrequencyExample.input),
    ).toEqual({
      ok: true,
      output: hartleyOscillatorFrequencyExample.output,
    });
  });

  it("adds mutual inductance into the total tank inductance", () => {
    expect(
      runHartleyOscillatorFrequency({
        cFarads: 1e-9,
        l1Henry: 1e-6,
        l2Henry: 1e-6,
        mutualH: 0.5e-6,
      }),
    ).toEqual({
      ok: true,
      output: { oscillationFrequencyHz: 2905758.415662736 },
    });
  });

  it("defaults mutual inductance to zero", () => {
    expect(
      runHartleyOscillatorFrequency({
        cFarads: 1e-9,
        l1Henry: 1e-6,
        l2Henry: 3e-6,
      }),
    ).toEqual({
      ok: true,
      output: { oscillationFrequencyHz: 2516460.605224352 },
    });
  });

  it("rejects negative mutual inductance through schema validation", () => {
    expect(
      runHartleyOscillatorFrequency({
        cFarads: 1e-9,
        l1Henry: 1e-6,
        l2Henry: 1e-6,
        mutualH: -0.5e-6,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero coil inductances", () => {
    expect(
      runHartleyOscillatorFrequency({
        cFarads: 1e-9,
        l1Henry: 0,
        l2Henry: 1e-6,
      }).ok,
    ).toBe(false);
  });

  it("requires the tank capacitance", () => {
    expect(
      runHartleyOscillatorFrequency({ l1Henry: 1e-6, l2Henry: 1e-6 }).ok,
    ).toBe(false);
  });
});
