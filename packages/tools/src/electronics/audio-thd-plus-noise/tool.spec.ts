import { describe, expect, it } from "vitest";
import { audioThdPlusNoiseExample, runAudioThdPlusNoise } from "./tool.js";

const outputOf = (input: {
  fundamentalV: number;
  harmonicsAndNoiseV: number;
}) => {
  const result = runAudioThdPlusNoise(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { thdPlusNoisePercent: number };
};

describe("THD+N Percent", () => {
  it("reproduces the canonical example", () =>
    expect(runAudioThdPlusNoise(audioThdPlusNoiseExample.input)).toEqual({
      ok: true,
      output: { thdPlusNoisePercent: 1 },
    }));

  it("reports zero percent for a clean residual", () =>
    expect(
      outputOf({ fundamentalV: 2.5, harmonicsAndNoiseV: 0 })
        .thdPlusNoisePercent,
    ).toBe(0));

  it("matches residual over fundamental times one hundred", () => {
    const { thdPlusNoisePercent } = outputOf({
      fundamentalV: 0.707,
      harmonicsAndNoiseV: 0.00707,
    });
    expect(thdPlusNoisePercent).toBeCloseTo((0.00707 / 0.707) * 100, 9);
  });

  it("is invariant to common scaling of both levels", () => {
    const base = outputOf({
      fundamentalV: 1,
      harmonicsAndNoiseV: 0.03,
    }).thdPlusNoisePercent;
    const scaled = outputOf({
      fundamentalV: 100,
      harmonicsAndNoiseV: 3,
    }).thdPlusNoisePercent;
    expect(scaled).toBeCloseTo(base, 9);
  });

  it("reports one hundred percent when residual equals fundamental", () =>
    expect(
      outputOf({ fundamentalV: 0.5, harmonicsAndNoiseV: 0.5 })
        .thdPlusNoisePercent,
    ).toBeCloseTo(100, 12));

  it("handles sub-percent distortion levels", () =>
    expect(
      outputOf({ fundamentalV: 5, harmonicsAndNoiseV: 0.00025 })
        .thdPlusNoisePercent,
    ).toBeCloseTo(0.005, 9));

  it("rejects non-positive fundamentals", () => {
    expect(
      runAudioThdPlusNoise({ fundamentalV: 0, harmonicsAndNoiseV: 0.01 }).ok,
    ).toBe(false);
    expect(
      runAudioThdPlusNoise({ fundamentalV: -1, harmonicsAndNoiseV: 0.01 }).ok,
    ).toBe(false);
  });

  it("rejects negative residuals but accepts zero", () => {
    expect(
      runAudioThdPlusNoise({ fundamentalV: 1, harmonicsAndNoiseV: -0.01 }).ok,
    ).toBe(false);
    expect(
      runAudioThdPlusNoise({ fundamentalV: 1, harmonicsAndNoiseV: 0 }).ok,
    ).toBe(true);
  });
});
