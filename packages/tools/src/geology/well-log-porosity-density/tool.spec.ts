import { describe, expect, it } from "vitest";
import {
  wellLogPorosityDensityExample,
  runWellLogPorosityDensity,
} from "./tool.js";

describe("geology/well-log-porosity-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWellLogPorosityDensity(wellLogPorosityDensityExample.input),
    ).toEqual({ ok: true, output: wellLogPorosityDensityExample.output });
  });

  it("returns zero porosity at matrix density and unity at fluid density", () => {
    const zero = runWellLogPorosityDensity({
      bulkDensityKgPerM3: 2650,
      matrixDensityKgPerM3: 2650,
      fluidDensityKgPerM3: 1000,
    });
    const full = runWellLogPorosityDensity({
      bulkDensityKgPerM3: 1000,
      matrixDensityKgPerM3: 2650,
      fluidDensityKgPerM3: 1000,
    });
    if (!zero.ok || !full.ok) throw new Error("expected success");
    expect(zero.output.densityPorosity).toBe(0);
    expect(full.output.densityPorosity).toBe(1);
  });

  it("rejects non-positive densities and degenerate matrix-fluid pairs", () => {
    expect(
      runWellLogPorosityDensity({
        bulkDensityKgPerM3: -1,
        matrixDensityKgPerM3: 2650,
        fluidDensityKgPerM3: 1000,
      }).ok,
    ).toBe(false);
    expect(
      runWellLogPorosityDensity({
        bulkDensityKgPerM3: 2350,
        matrixDensityKgPerM3: 1000,
        fluidDensityKgPerM3: 1000,
      }).ok,
    ).toBe(false);
  });
});
