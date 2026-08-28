import { describe, expect, it } from "vitest";
import { runSignalToNoise, signalToNoiseExample } from "./tool.js";
describe("Signal To Noise Ratio", () => {
  it("publishes an executable example", () =>
    expect(runSignalToNoise(signalToNoiseExample.input)).toEqual({
      ok: true,
      output: signalToNoiseExample.output,
    }));
  it("scales linearly with the mean signal", () =>
    expect(
      runSignalToNoise({ meanSignal: 250, noiseStandardDeviation: 5 }),
    ).toEqual({ ok: true, output: { signalToNoiseRatio: 50 } }));
  it("allows a zero mean signal", () =>
    expect(
      runSignalToNoise({ meanSignal: 0, noiseStandardDeviation: 2 }),
    ).toEqual({ ok: true, output: { signalToNoiseRatio: 0 } }));
  it("rejects zero noise", () =>
    expect(
      runSignalToNoise({ meanSignal: 100, noiseStandardDeviation: 0 }).ok,
    ).toBe(false));
  it("rejects negative noise", () =>
    expect(
      runSignalToNoise({ meanSignal: 100, noiseStandardDeviation: -1 }).ok,
    ).toBe(false));
  it("rejects a negative mean signal", () =>
    expect(
      runSignalToNoise({ meanSignal: -1, noiseStandardDeviation: 2 }).ok,
    ).toBe(false));
});
