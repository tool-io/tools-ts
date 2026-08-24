import { describe, expect, it } from "vitest";
import { runStackingFaultEnergy, stackingFaultEnergyExample } from "./tool.js";

describe("stacking-fault energy", () => {
  it("reproduces the documented conversion", () =>
    expect(runStackingFaultEnergy(stackingFaultEnergyExample.input)).toEqual({
      ok: true,
      output: stackingFaultEnergyExample.output,
    }));
  it("returns zero for zero formation energy", () =>
    expect(
      runStackingFaultEnergy({ atomDensityPerNm2: 8, faultEnergyEvPerAtom: 0 }),
    ).toEqual({ ok: true, output: { stackingFaultEnergyMilliJPerM2: 0 } }));
  it("requires a positive planar atom density", () =>
    expect(
      runStackingFaultEnergy({
        atomDensityPerNm2: 0,
        faultEnergyEvPerAtom: 0.02,
      }),
    ).toMatchObject({ ok: false }));
});
