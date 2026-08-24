import { describe, expect, it } from "vitest";
import {
  runSolarCellShortCircuitCurrentDensity,
  solarCellShortCircuitCurrentDensityExample,
} from "./tool.js";

describe("solar-cell short-circuit current density", () => {
  it("reproduces the documented example", () =>
    expect(
      runSolarCellShortCircuitCurrentDensity(
        solarCellShortCircuitCurrentDensityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: solarCellShortCircuitCurrentDensityExample.output,
    }));
  it("returns zero when no photons arrive", () =>
    expect(
      runSolarCellShortCircuitCurrentDensity({
        externalQuantumEfficiencyPercent: 80,
        photonFluxPerCm2PerS: 0,
      }),
    ).toEqual({ ok: true, output: { jscMAPerCm2: 0 } }));
  it("permits gain-enhanced external quantum efficiency above 100 percent", () =>
    expect(
      runSolarCellShortCircuitCurrentDensity({
        externalQuantumEfficiencyPercent: 200,
        photonFluxPerCm2PerS: 1e16,
      }),
    ).toMatchObject({ ok: true }));
});
