import { describe, expect, it } from "vitest";
import {
  calculateWindOscillationAmplitude,
  runWindOscillationAmplitude,
  windOscillationAmplitudeExample,
} from "./tool.js";

describe("Oscillation Amplitude", () => {
  it("publishes an executable example", () =>
    expect(
      runWindOscillationAmplitude(windOscillationAmplitudeExample.input),
    ).toEqual({
      ok: true,
      output: windOscillationAmplitudeExample.output,
    }));

  it.each([
    [300, 280, 10],
    [45, 0, 22.5],
    [360, 0, 0],
    [350, 10, 10],
    [12.5, 10.5, 1],
  ])(
    "computes half the heading spread",
    (maxHeadingDeg, minHeadingDeg, expected) => {
      expect(
        calculateWindOscillationAmplitude({ maxHeadingDeg, minHeadingDeg }),
      ).toEqual({
        amplitudeDegrees: expected,
      });
    },
  );

  it("returns zero for a steady heading", () =>
    expect(
      runWindOscillationAmplitude({ maxHeadingDeg: 42, minHeadingDeg: 42 }),
    ).toEqual({
      ok: true,
      output: { amplitudeDegrees: 0 },
    }));

  it("accepts headings at the zero and three-sixty bounds", () => {
    expect(
      runWindOscillationAmplitude({ maxHeadingDeg: 0, minHeadingDeg: 0 }).ok,
    ).toBe(true);
    expect(
      runWindOscillationAmplitude({ maxHeadingDeg: 360, minHeadingDeg: 359 })
        .ok,
    ).toBe(true);
  });

  it("does not depend on the order of the two extremes", () => {
    const result = runWindOscillationAmplitude({
      maxHeadingDeg: 100,
      minHeadingDeg: 120,
    });
    expect(result).toEqual({ ok: true, output: { amplitudeDegrees: 10 } });
  });

  it("rejects headings outside zero to three-sixty", () => {
    for (const input of [
      { maxHeadingDeg: 361, minHeadingDeg: 0 },
      { maxHeadingDeg: 100, minHeadingDeg: -1 },
      { maxHeadingDeg: -5, minHeadingDeg: -10 },
    ])
      expect(runWindOscillationAmplitude(input).ok).toBe(false);
  });

  it("rejects non-finite input", () => {
    expect(
      runWindOscillationAmplitude({
        maxHeadingDeg: Number.NaN,
        minHeadingDeg: 100,
      }).ok,
    ).toBe(false);
    expect(
      runWindOscillationAmplitude({
        maxHeadingDeg: 200,
        minHeadingDeg: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing and malformed input", () => {
    expect(runWindOscillationAmplitude({ minHeadingDeg: 100 }).ok).toBe(false);
    expect(
      runWindOscillationAmplitude({ maxHeadingDeg: 150, minHeadingDeg: true })
        .ok,
    ).toBe(false);
  });
});
