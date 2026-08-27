import { describe, expect, it } from "vitest";
import { audioPowerToSplExample, runAudioPowerToSpl } from "./tool.js";

const outputOf = (input: {
  amplifierWatts: number;
  sensitivityDbPerW1m: number;
}) => {
  const result = runAudioPowerToSpl(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { splOneMeterDb: number };
};

describe("Power To SPL", () => {
  it("reproduces the canonical example", () =>
    expect(runAudioPowerToSpl(audioPowerToSplExample.input)).toEqual({
      ok: true,
      output: { splOneMeterDb: 107 },
    }));

  it("equals sensitivity at one watt", () =>
    expect(
      outputOf({ amplifierWatts: 1, sensitivityDbPerW1m: 89 }).splOneMeterDb,
    ).toBeCloseTo(89, 12));

  it("adds ten decibels per decade of wattage", () => {
    const atOne = outputOf({
      amplifierWatts: 1,
      sensitivityDbPerW1m: 86,
    }).splOneMeterDb;
    const atTen = outputOf({
      amplifierWatts: 10,
      sensitivityDbPerW1m: 86,
    }).splOneMeterDb;
    expect(atTen - atOne).toBeCloseTo(10, 12);
  });

  it("adds three decibels when power doubles", () => {
    const base = outputOf({
      amplifierWatts: 20,
      sensitivityDbPerW1m: 90,
    }).splOneMeterDb;
    const doubled = outputOf({
      amplifierWatts: 40,
      sensitivityDbPerW1m: 90,
    }).splOneMeterDb;
    expect(doubled - base).toBeCloseTo(10 * Math.log10(2), 12);
  });

  it("matches sensitivity plus ten log ten watts generally", () => {
    const { splOneMeterDb } = outputOf({
      amplifierWatts: 7.5,
      sensitivityDbPerW1m: 84.2,
    });
    expect(splOneMeterDb).toBeCloseTo(84.2 + 10 * Math.log10(7.5), 12);
  });

  it("supports sub-watt amplifiers", () =>
    expect(
      outputOf({ amplifierWatts: 0.1, sensitivityDbPerW1m: 88 }).splOneMeterDb,
    ).toBeCloseTo(78, 12));

  it("rejects non-positive amplifier power", () => {
    expect(
      runAudioPowerToSpl({ amplifierWatts: 0, sensitivityDbPerW1m: 87 }).ok,
    ).toBe(false);
    expect(
      runAudioPowerToSpl({ amplifierWatts: -3, sensitivityDbPerW1m: 87 }).ok,
    ).toBe(false);
  });

  it("accepts negative sensitivity values", () =>
    expect(
      outputOf({ amplifierWatts: 100, sensitivityDbPerW1m: -6 }).splOneMeterDb,
    ).toBeCloseTo(14, 12));
});
