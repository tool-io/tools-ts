import { describe, expect, it } from "vitest";
import {
  membraneStabilityIndexExample,
  runMembraneStabilityIndex,
} from "./tool.js";

describe("MSI Percent", () => {
  it("publishes an executable example", () =>
    expect(
      runMembraneStabilityIndex(membraneStabilityIndexExample.input),
    ).toEqual({
      ok: true,
      output: membraneStabilityIndexExample.output,
    }));
  it("returns one hundred percent for perfectly stable membranes", () =>
    expect(
      runMembraneStabilityIndex({
        boiledConductivityUs: 250,
        initialConductivityUs: 0,
      }),
    ).toEqual({ ok: true, output: { membraneStabilityIndexPercent: 100 } }));
  it("returns zero stability when conductivities match", () =>
    expect(
      runMembraneStabilityIndex({
        boiledConductivityUs: 300,
        initialConductivityUs: 300,
      }),
    ).toEqual({ ok: true, output: { membraneStabilityIndexPercent: 0 } }));
  it("supports fractional stability", () => {
    const result = runMembraneStabilityIndex({
      boiledConductivityUs: 400,
      initialConductivityUs: 90,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.membraneStabilityIndexPercent).toBe(77.5);
  });
  it("complements electrolyte leakage", () => {
    const result = runMembraneStabilityIndex({
      boiledConductivityUs: 300,
      initialConductivityUs: 120,
    });
    if (result.ok)
      expect(
        Number(result.output.membraneStabilityIndexPercent) + (120 / 300) * 100,
      ).toBe(100);
    else expect.fail("the calculation should succeed");
  });
  it("rejects zero boiled conductivity", () => {
    const result = runMembraneStabilityIndex({
      boiledConductivityUs: 0,
      initialConductivityUs: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_conductivities");
  });
  it("rejects initial conductivity above boiled conductivity", () => {
    const result = runMembraneStabilityIndex({
      boiledConductivityUs: 150,
      initialConductivityUs: 200,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_conductivities");
  });
});
