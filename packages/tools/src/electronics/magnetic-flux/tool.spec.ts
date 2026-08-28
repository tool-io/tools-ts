import { describe, expect, it } from "vitest";
import { magneticFluxExample, runMagneticFlux } from "./tool.js";
describe("Magnetic Flux Wb", () => {
  it("publishes an executable example", () =>
    expect(runMagneticFlux(magneticFluxExample.input)).toEqual({
      ok: true,
      output: magneticFluxExample.output,
    }));
  it("allows zero flux density", () =>
    expect(runMagneticFlux({ fluxDensityTesla: 0, areaM2: 3 })).toEqual({
      ok: true,
      output: { magneticFluxWb: 0 },
    }));
  it("rejects negative flux density", () =>
    expect(runMagneticFlux({ fluxDensityTesla: -1, areaM2: 1 }).ok).toBe(
      false,
    ));
  it("rejects zero area", () =>
    expect(runMagneticFlux({ fluxDensityTesla: 1, areaM2: 0 }).ok).toBe(false));
});
