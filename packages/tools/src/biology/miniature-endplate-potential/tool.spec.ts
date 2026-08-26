import { describe, expect, it } from "vitest";
import { runMiniatureEndplatePotential } from "./tool.js";

describe("MEPP Amplitude Mean", () => {
  it("calculates a valid result", () =>
    expect(
      runMiniatureEndplatePotential({ eventCountInt: 48, sumAmplitudesMv: 12 }),
    ).toEqual({
      ok: true,
      output: { meanAmplitudeMv: 0.25 },
    }));
  it("returns the amplitude itself for a single event", () =>
    expect(
      runMiniatureEndplatePotential({ eventCountInt: 1, sumAmplitudesMv: 0.9 }),
    ).toEqual({
      ok: true,
      output: { meanAmplitudeMv: 0.9 },
    }));
  it("accepts a zero summed amplitude", () =>
    expect(
      runMiniatureEndplatePotential({ eventCountInt: 10, sumAmplitudesMv: 0 }),
    ).toEqual({
      ok: true,
      output: { meanAmplitudeMv: 0 },
    }));
  it("scales inversely with the event count", () => {
    const result = runMiniatureEndplatePotential({
      eventCountInt: 24,
      sumAmplitudesMv: 12,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.meanAmplitudeMv).toBe(0.5);
  });
  it("rejects an event count of zero", () =>
    expect(
      runMiniatureEndplatePotential({ eventCountInt: 0, sumAmplitudesMv: 10 }),
    ).toMatchObject({ ok: false }));
  it("rejects negative event counts", () =>
    expect(
      runMiniatureEndplatePotential({
        eventCountInt: -3,
        sumAmplitudesMv: 10,
      }).ok,
    ).toBe(false));
  it("rejects negative summed amplitudes", () =>
    expect(
      runMiniatureEndplatePotential({
        eventCountInt: 5,
        sumAmplitudesMv: -1,
      }).ok,
    ).toBe(false));
  it("rejects fractional event counts", () =>
    expect(
      runMiniatureEndplatePotential({
        eventCountInt: 2.5,
        sumAmplitudesMv: 10,
      }).ok,
    ).toBe(false));
});
