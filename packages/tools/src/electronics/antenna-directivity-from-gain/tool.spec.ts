import { describe, expect, it } from "vitest";
import {
  antennaDirectivityFromGainExample,
  runAntennaDirectivityFromGain,
} from "./tool.js";

const outputOf = (input: { efficiencyFraction?: number; gainDbi: number }) => {
  const result = runAntennaDirectivityFromGain(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { directivityDbi: number };
};

describe("Directivity From Gain", () => {
  it("reproduces the canonical example with default efficiency", () =>
    expect(
      runAntennaDirectivityFromGain(antennaDirectivityFromGainExample.input),
    ).toEqual({
      ok: true,
      output: { directivityDbi: 14.218487496163563 },
    }));

  it("equals the default-efficiency result when omitted", () =>
    expect(runAntennaDirectivityFromGain({ gainDbi: 8 })).toEqual(
      runAntennaDirectivityFromGain({ efficiencyFraction: 0.6, gainDbi: 8 }),
    ));

  it("subtracts ten log10 of the supplied efficiency", () => {
    const { directivityDbi } = outputOf({
      efficiencyFraction: 0.55,
      gainDbi: 21.5,
    });
    expect(directivityDbi).toBeCloseTo(21.5 - 10 * Math.log10(0.55), 12);
  });

  it("returns the gain unchanged at unity efficiency", () =>
    expect(
      outputOf({ efficiencyFraction: 0.9999999999, gainDbi: 12 })
        .directivityDbi,
    ).toBeCloseTo(12, 6));

  it("adds about three decibels at fifty percent efficiency", () =>
    expect(
      outputOf({ efficiencyFraction: 0.5, gainDbi: 10 }).directivityDbi,
    ).toBeCloseTo(10 + 10 * Math.log10(2), 12));

  it("increases as efficiency decreases", () => {
    const high = outputOf({
      efficiencyFraction: 0.9,
      gainDbi: 10,
    }).directivityDbi;
    const low = outputOf({
      efficiencyFraction: 0.3,
      gainDbi: 10,
    }).directivityDbi;
    expect(low).toBeGreaterThan(high);
  });

  it("rejects zero and unity efficiency fractions exclusively", () => {
    expect(
      runAntennaDirectivityFromGain({ efficiencyFraction: 0, gainDbi: 10 }).ok,
    ).toBe(false);
    expect(
      runAntennaDirectivityFromGain({ efficiencyFraction: 1, gainDbi: 10 }).ok,
    ).toBe(false);
  });

  it("rejects out-of-range efficiency beyond schema bounds", () =>
    expect(
      runAntennaDirectivityFromGain({ efficiencyFraction: 1.5, gainDbi: 10 })
        .ok,
    ).toBe(false));
});
