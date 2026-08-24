import { describe, expect, it } from "vitest";
import {
  runSurfaceRoughnessMobility,
  surfaceRoughnessMobilityExample,
} from "./tool.js";

describe("empirical surface-roughness mobility", () => {
  it("reproduces the documented example", () =>
    expect(
      runSurfaceRoughnessMobility(surfaceRoughnessMobilityExample.input),
    ).toEqual({ ok: true, output: surfaceRoughnessMobilityExample.output }));
  it("equals reference mobility at the reference field", () =>
    expect(
      runSurfaceRoughnessMobility({
        effectiveFieldVCm: 5e5,
        referenceFieldVCm: 5e5,
        referenceMobility: 1400,
      }),
    ).toEqual({ ok: true, output: { mobilityCm2PerVs: 1400 } }));
  it("requires explicit calibration values", () =>
    expect(
      runSurfaceRoughnessMobility({ effectiveFieldVCm: 1e6 } as never),
    ).toMatchObject({ ok: false }));
});
