import { describe, expect, it } from "vitest";
import {
  porePressurePredictionEatonSonicExample,
  runPorePressurePredictionEatonSonic,
} from "./tool.js";

describe("pore-pressure-prediction-eaton-sonic", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPorePressurePredictionEatonSonic(
        porePressurePredictionEatonSonicExample.input,
      ),
    ).toEqual({
      ok: true,
      output: porePressurePredictionEatonSonicExample.output,
    });
  });

  it("returns the normal pressure when the sonic sits on the trend", () => {
    const result = runPorePressurePredictionEatonSonic({
      normalPorePressureMegapascals: 19.6,
      normalSonicMicrosecondsPerMetre: 200,
      observedSonicMicrosecondsPerMetre: 200,
      overburdenStressMegapascals: 45.1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.porePressureMegapascals).toBeCloseTo(19.6, 9);
  });

  it("rejects non-positive sonic travel times", () => {
    expect(
      runPorePressurePredictionEatonSonic({
        normalPorePressureMegapascals: 19.6,
        normalSonicMicrosecondsPerMetre: 0,
        observedSonicMicrosecondsPerMetre: 250,
        overburdenStressMegapascals: 45.1,
      }).ok,
    ).toBe(false);
  });
});
