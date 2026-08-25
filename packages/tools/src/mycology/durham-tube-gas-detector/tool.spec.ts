import { describe, expect, it } from "vitest";
import {
  durhamTubeGasDetectorExample,
  runDurhamTubeGasDetector,
} from "./tool.js";

describe("Durham Gas Detector", () => {
  it("matches the canonical example", () =>
    expect(
      runDurhamTubeGasDetector(durhamTubeGasDetectorExample.input),
    ).toEqual({ ok: true, output: durhamTubeGasDetectorExample.output }));
  it("detects gas when it is trapped", () =>
    expect(runDurhamTubeGasDetector({ gasTrapped: true })).toEqual({
      ok: true,
      output: {
        gasProductionDetected: true,
        gasTrapped: true,
        interpretation:
          "Gas was trapped in the Durham tube; interpret acid production separately.",
      },
    }));
  it("does not infer the absence of acid fermentation", () =>
    expect(runDurhamTubeGasDetector({ gasTrapped: false })).toEqual({
      ok: true,
      output: {
        gasProductionDetected: false,
        gasTrapped: false,
        interpretation:
          "No gas was trapped in the Durham tube; this does not exclude acid-only fermentation.",
      },
    }));
  it("mirrors the observation into the flag", () => {
    for (const gasTrapped of [true, false]) {
      const result = runDurhamTubeGasDetector({ gasTrapped });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.gasProductionDetected).toBe(
          result.output.gasTrapped,
        );
    }
  });
  it("is stable across repeat runs", () => {
    const first = runDurhamTubeGasDetector({ gasTrapped: false });
    const second = runDurhamTubeGasDetector({ gasTrapped: false });
    expect(first).toEqual(second);
  });
  it("rejects non-boolean observations", () =>
    expect(runDurhamTubeGasDetector({ gasTrapped: 1 }).ok).toBe(false));
});
