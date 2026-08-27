import { describe, expect, it } from "vitest";
import {
  colpittsOscillatorFrequencyExample,
  runColpittsOscillatorFrequency,
} from "./tool.js";

describe("Colpitts Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runColpittsOscillatorFrequency(colpittsOscillatorFrequencyExample.input),
    ).toEqual({
      ok: true,
      output: colpittsOscillatorFrequencyExample.output,
    });
  });

  it("series-combines unequal capacitors before resonance", () => {
    expect(
      runColpittsOscillatorFrequency({
        c1Farads: 1e-8,
        c2Farads: 4e-8,
        lHenry: 1e-3,
      }),
    ).toEqual({
      ok: true,
      output: { oscillationFrequencyHz: 56269.76975981913 },
    });
  });

  it("halves frequency when inductance quadruples", () => {
    expect(
      runColpittsOscillatorFrequency({
        c1Farads: 1e-8,
        c2Farads: 1e-8,
        lHenry: 4e-3,
      }),
    ).toEqual({
      ok: true,
      output: { oscillationFrequencyHz: 35588.12717085885 },
    });
  });

  it("rejects zero inductance", () => {
    expect(
      runColpittsOscillatorFrequency({
        c1Farads: 1e-8,
        c2Farads: 1e-8,
        lHenry: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero capacitances", () => {
    expect(
      runColpittsOscillatorFrequency({
        c1Farads: 1e-8,
        c2Farads: 0,
        lHenry: 1e-3,
      }).ok,
    ).toBe(false);
  });

  it("requires all three parts", () => {
    expect(
      runColpittsOscillatorFrequency({ c1Farads: 1e-8, c2Farads: 1e-8 }).ok,
    ).toBe(false);
  });
});
