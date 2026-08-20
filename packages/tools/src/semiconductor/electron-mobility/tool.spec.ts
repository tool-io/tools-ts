import { describe, expect, it } from "vitest";
import { electronMobilityExample, runElectronMobility } from "./tool.js";

describe("electron mobility calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runElectronMobility(electronMobilityExample.input)).toEqual({
      ok: true,
      output: electronMobilityExample.output,
    });
  });

  it("approaches the low-doping limit for light doping", () => {
    const output = runElectronMobility({ donorConcentrationPerCm3: 1e12 });
    if (!output.ok) throw new Error("expected success");
    // Caughey-Thomas upper bound is mu_max = 1268 cm^2/Vs.
    expect(output.output.mobilityCm2PerVs).toBeGreaterThan(1267);
    expect(output.output.mobilityCm2PerVs).toBeLessThanOrEqual(1268);
  });

  it("rejects non-positive doping through execution", () => {
    expect(runElectronMobility({ donorConcentrationPerCm3: 0 })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_doping" }] },
        ok: false,
      },
    );
  });
});
