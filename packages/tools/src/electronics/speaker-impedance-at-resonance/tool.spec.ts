import { describe, expect, it } from "vitest";
import {
  speakerImpedanceAtResonanceExample,
  runSpeakerImpedanceAtResonance,
} from "./tool.js";

const outputOf = (input: {
  dcResistanceOhms: number;
  qesFactor: number;
  qmsFactor: number;
}) => {
  const result = runSpeakerImpedanceAtResonance(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { resonanceImpedanceOhms: number };
};

describe("Resonance Impedance Peak", () => {
  it("reproduces the canonical example", () =>
    expect(
      runSpeakerImpedanceAtResonance(speakerImpedanceAtResonanceExample.input),
    ).toEqual({
      ok: true,
      output: { resonanceImpedanceOhms: 66 },
    }));

  it("uses the Qms to Qes ratio", () => {
    const { resonanceImpedanceOhms } = outputOf({
      dcResistanceOhms: 5.5,
      qesFactor: 0.5,
      qmsFactor: 8.2,
    });
    expect(resonanceImpedanceOhms).toBeCloseTo(5.5 * (1 + 8.2 / 0.5), 12);
  });

  it("scales linearly with DC resistance", () => {
    const four = outputOf({
      dcResistanceOhms: 4,
      qesFactor: 0.5,
      qmsFactor: 5,
    }).resonanceImpedanceOhms;
    const eight = outputOf({
      dcResistanceOhms: 8,
      qesFactor: 0.5,
      qmsFactor: 5,
    }).resonanceImpedanceOhms;
    expect(eight).toBeCloseTo(four * 2, 12);
  });

  it("scales linearly with Qms", () => {
    const low = outputOf({
      dcResistanceOhms: 6,
      qesFactor: 1,
      qmsFactor: 2,
    }).resonanceImpedanceOhms;
    const high = outputOf({
      dcResistanceOhms: 6,
      qesFactor: 1,
      qmsFactor: 10,
    }).resonanceImpedanceOhms;
    expect(high).toBeCloseTo(66, 12);
  });

  it("rejects non-positive DC resistance", () => {
    expect(
      runSpeakerImpedanceAtResonance({
        dcResistanceOhms: 0,
        qesFactor: 0.5,
        qmsFactor: 5,
      }).ok,
    ).toBe(false);
    expect(
      runSpeakerImpedanceAtResonance({
        dcResistanceOhms: -6,
        qesFactor: 0.5,
        qmsFactor: 5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive Qms overrides", () =>
    expect(
      runSpeakerImpedanceAtResonance({
        dcResistanceOhms: 6,
        qesFactor: 0.5,
        qmsFactor: 0,
      }).ok,
    ).toBe(false));

  it("rejects non-positive Qes", () =>
    expect(
      runSpeakerImpedanceAtResonance({
        dcResistanceOhms: 6,
        qesFactor: 0,
        qmsFactor: 5,
      }).ok,
    ).toBe(false));
});
