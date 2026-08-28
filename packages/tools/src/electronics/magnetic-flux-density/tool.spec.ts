import { describe, expect, it } from "vitest";
import { magneticFluxDensityExample, runMagneticFluxDensity } from "./tool.js";
describe("Flux Density Tesla", () => {
  it("publishes an executable example", () =>
    expect(runMagneticFluxDensity(magneticFluxDensityExample.input)).toEqual({
      ok: true,
      output: magneticFluxDensityExample.output,
    }));
  it("keeps negative flux signed", () =>
    expect(runMagneticFluxDensity({ fluxWb: -2, areaM2: 4 })).toEqual({
      ok: true,
      output: { fluxDensityTesla: -0.5 },
    }));
  it("rejects zero area", () =>
    expect(runMagneticFluxDensity({ fluxWb: 1, areaM2: 0 }).ok).toBe(false));
});
