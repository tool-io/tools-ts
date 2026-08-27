import { describe, expect, it } from "vitest";
import {
  porePressurePredictionEatonResistivityExample,
  runPorePressurePredictionEatonResistivity,
} from "./tool.js";

describe("pore-pressure-prediction-eaton-resistivity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPorePressurePredictionEatonResistivity(
        porePressurePredictionEatonResistivityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: porePressurePredictionEatonResistivityExample.output,
    });
  });

  it("returns the normal pressure when the resistivity sits on the trend", () => {
    const result = runPorePressurePredictionEatonResistivity({
      normalPorePressureMegapascals: 19.6,
      normalShaleResistivityOhmMetres: 4,
      observedShaleResistivityOhmMetres: 4,
      overburdenStressMegapascals: 45.1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.porePressureMegapascals).toBeCloseTo(19.6, 9);
  });

  it("rejects non-positive resistivities", () => {
    expect(
      runPorePressurePredictionEatonResistivity({
        normalPorePressureMegapascals: 19.6,
        normalShaleResistivityOhmMetres: -1,
        observedShaleResistivityOhmMetres: 2,
        overburdenStressMegapascals: 45.1,
      }).ok,
    ).toBe(false);
  });
});
