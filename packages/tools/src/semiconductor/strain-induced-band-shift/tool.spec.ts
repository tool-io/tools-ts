import { describe, expect, it } from "vitest";
import {
  runStrainInducedBandShift,
  strainInducedBandShiftExample,
} from "./tool.js";

describe("hydrostatic strain-induced band shift", () => {
  it("reproduces the documented example", () =>
    expect(
      runStrainInducedBandShift(strainInducedBandShiftExample.input),
    ).toEqual({ ok: true, output: strainInducedBandShiftExample.output }));
  it("returns zero for a traceless strain state", () =>
    expect(
      runStrainInducedBandShift({
        conductionBandDeformationPotentialEv: -5,
        normalStrain: -0.02,
        parallelStrain: 0.01,
      }),
    ).toEqual({ ok: true, output: { bandEdgeShiftMeV: -0 } }));
  it("requires an explicit material deformation potential", () =>
    expect(
      runStrainInducedBandShift({
        normalStrain: -0.01,
        parallelStrain: 0.01,
      } as never),
    ).toMatchObject({ ok: false }));
});
