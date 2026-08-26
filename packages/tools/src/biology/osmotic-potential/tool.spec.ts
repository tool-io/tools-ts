import { describe, expect, it } from "vitest";
import { osmoticPotentialExample, runOsmoticPotential } from "./tool.js";

describe("Osmotic Potential Van't Hoff", () => {
  it("publishes an executable example using the default van't Hoff factor", () =>
    expect(runOsmoticPotential(osmoticPotentialExample.input)).toEqual({
      ok: true,
      output: osmoticPotentialExample.output,
    }));
  it("scales with the van't Hoff factor", () =>
    expect(
      runOsmoticPotential({ concentrationMolal: 0.2, vanthoffFactor: 2 }),
    ).toEqual({
      ok: true,
      output: { osmoticPotentialMpa: -(2 * 0.2) * 2.437 },
    }));
  it("returns zero at zero concentration", () =>
    expect(runOsmoticPotential({ concentrationMolal: 0 })).toEqual({
      ok: true,
      output: { osmoticPotentialMpa: -0 },
    }));
  it("stays negative for positive concentrations", () => {
    const result = runOsmoticPotential({
      concentrationMolal: 0.75,
      vanthoffFactor: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.osmoticPotentialMpa).toBeLessThan(0);
  });
  it("rejects negative concentrations", () =>
    expect(runOsmoticPotential({ concentrationMolal: -0.1 }).ok).toBe(false));
  it("rejects van't Hoff factors outside one to three", () => {
    expect(
      runOsmoticPotential({ concentrationMolal: 0.2, vanthoffFactor: 0.5 }).ok,
    ).toBe(false);
    expect(
      runOsmoticPotential({ concentrationMolal: 0.2, vanthoffFactor: 4 }).ok,
    ).toBe(false);
  });
});
